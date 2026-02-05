# HLD Question Notes


## Google Docs

- Document meta data flow
- Separate flow for write on Cassandra with WS

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/google-docs)
- [NeetCode](https://www.youtube.com/watch?v=9JKBlkwg0yM&t=2152s)
- [Jordan](https://www.youtube.com/watch?v=YCjVIDv0zQY&t=2695s)


## URL shortener (like Bit.ly)

- Use global counter (with bijective mapping) -> put in DB -> read through cache
- Explore custom url, expiration time, 301/302, separate read/write service as skewed towards read

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/bitly)


## Ad click aggregator

- Vend ad meta data
- [Approach 1] Click -> Cassandra -> Spark -> OLAP -> Analytics Query
- [Approach 2] Click -> Kafka -> Flink -> OLAP -> Analytics Query (Kappa)
- [Approach 3] Approach 1 + 2, realtime + periodic reconciliation (~ Lambda)
- Lambda: “Stream for now, batch for truth.”
- Kappa: “The log is truth; replay when needed.”

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/ad-click-aggregator)


## Live Comments

- [Approach 1] Write to DynamoDB -> PubSub -> SSE
- [Approach 2] Write to DynamoDB -> Dispatch event -> Colocated user servers -> SSE
- [Approach 3] Write to Kafka -> DynamoDB write consumer -> PubSub consumers with colocated users -> SSE

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/fb-live-comments)


## Ticketmaster

- Event/ticket CRUD, search for events
- For booking do it in 2 phase, reserve and book, use distributed lock for booking, Redis
- Other optimizations:
  - Cache event info
  - Optimize events search: DB -> CDC -> ElasticSerach
  - Real time booking update use SSE
  - Virtual waiting queues for big events maybe

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/ticketmaster)


## Uber

- Upon estimate request, create Ride, then confirm estimate and start matching
- Nearby driver gets notified (like Firebase), driver updates their location periodically, accpets and gets matched
- For location use Geohashing (Redis) instead of PostGIS (postgres) (Quad Trees)
- For one to one matching, use distributed lock with TTL (Redis) or high throughput DB like DynamoDB
- For location do not need to remember technologies, say will choose a storage based on:
  - Update frequency, like restaurant location OR driver location
  - Query type, like closest to a point OR all in this polygon OR any specific
  - Density of nodes
  - Reliability tradeoff, like restaurant location (high) OR driver location (less reliable is fine)
  - Solutions are like, PostGIS, Redis Geohashing, ElasticSearch (with geo index), etc.

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/uber)


## Yelp

- Fast search for business (location + full text), then view, then review
- Business CRUD and review separate
- [Approach 1] PostGIS + pg.trgm, both extensions of postgres to search faster
- [Approach 2] Durable storage -> CDC (Kafka + Worker) -> ElasticSearch (for fast search)
- Use ElasticSearch for:
  - geospatial index
  - inverted index on full text
  - b-tree for categories
- Avg review, solve with saving total number of reviews
- 1 review per user, use DB unique constraint
- Location will be searched by string, convert it to lat-long, or save location heirarchy in business entity

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/yelp)


## Payment System (like Stripe)

- Idempotency is important at each step, api calls, message queues, everywhere
- Approach: 
  - create payment intent (use API key + secret + timestamp + nonce for merchant-3P payment (us) communication)
  - use multiple transaction within an intent
  - open iframe at client (asymmetric encryption here) for each transaction
  - record changes for audit (in history OR S3)
  - tell merchant later by webhooks

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/payment-system)


## Stock Broker (like Robinhood)

- For live updates:
  - SSE from exchange
  - PubSub with SSE to client
- For orders:
  - An order service
  - order dispatch gateway (get extOrderId)
  - expose webhooks to exchange to listen to order (can use clientOrderIds)
  - DB data sanitize job (to reconcile faults)

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/robinhood)
- [ByteMonk](https://www.youtube.com/watch?v=4wvIU0O1xro)
- [ByteMonk](https://www.youtube.com/watch?v=iwRaNYa8yTw)


## Online Auction

- Service1 to get auction + current bid + maintain auction based colocated SSE connections
- Service2 to process bids and update Service1 about bid updates

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/online-auction)


## Whatsapp

- Schema: Chat (with participants), Messages, Inbox (for delivery, right away to online + later to offline)
- Some relation, but can be denormalized and stored in Dynamo for scale
- [Approach 1] Consistent hashing + Zookeeper for websocket scaling
- [Approach 2] Redis Pub/sub for websocket scaling
- Explanation: With Approach 1, we are finding a server for a user deterministically, and
  maybe later use the same deterministic mechanism to post messages to those user, but
  then there will be load on it, to assign user and post message, so
  so why not save the deterministic allocation in a cache and use it for posting messages?
  and if we are saving the mechanism anyways, why do we need it to be deterministic,
  let Load balancer handle the assignment and save it in cache,
  message delivery guarantee is lowered but we have User Inbox for durable delivery, so fine
  That's how we reach Approach 2 from 1

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/whatsapp)


## Distributed Job Scheduler

- Accept Jobs at scale
- Periodically create Execution instances for Job, create many in advance like for a day or a month or all till end time
- A watcher to pick upcoming tasks (to be executed soon tasks)
- Put them in a Queue-like store from where horizontally scaled workers can pick and execute
- Store can be SQS (with visibility time out) OR Redis min-heap
- Note: If a Job is created and is to be executed close to right away: create some Executions while creating Job too, and if those executions are within watcher time interval, put them in Queue-like store too

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/job-scheduler)


## Dropbox / Google Drive with local file system client

- Resumable upload/download (chunking), list, view items, sync
- Upload/download via S3 key (looks like path), via presigned url, multi-part upload
- Update upload status by S3 notifications (or by trust client and verify with S3)
- Client sync through sync service, periodic state hash check or state change
- Sync only updated chunk
- Event bus for version history, it contains all change events

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/dropbox)


## Youtube

- Upload and save just like Dropbox above, video in S3, metadata in a DB
- After save in S3, for low bandwidth downloads
  - chunk it in 2-10s small videos
  - convert it to varying resolution like 240p ... 4k
  - udpate video metadata with chunk info
- Use CDN for popular videos
- Streaming protocols
  - HLS
  - DASH

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/youtube)


## FB posts and search

- Functionality: Post, Like, Fast Search with keyword, Sort by time and likes
- Post and like through service, store separately in DBs, not tightly relational
- Note: Do not need to do like validation with DB, instead sign post info while showing, like who when, and verify at read
- For scale use maybe
  - GSI, or
  - 2 tables with primary keys (user, post) and (post, user)
- CDC from DB into search index store through a ingestion service
  - post needs to be tokenized (basically processed) and count is less
  - like count far more than posts, likes can be batched, do intelligent batching for posts which have very less likes
- Store search index on a Redis cluster, partition by keyword, for hot partition add 1....N in key maybe
- Store keyword to sorted posts list by createdAt & likes

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/fb-post-search)


## Twitter

- Profile service with following info
- Tweet CRUD, with S3 + CDN for media
- Replies separately, indexed on tweetId
- For search, ElasticSearch + CDC on tweets
- For timeline
  - fan-out on write to follower timeline cache
  - for celebrity, do not fan out, read on timeline
- Security and monitoring (health check, logging, ELK, alerts)

#### Sources
- [Hello interview](https://www.youtube.com/watch?v=Nfa-uUHuFHg&list=PL5q3E8eRUieWtYLmRU3z94-vGRcwKr9tM&index=8)


## FB news feed

- Create posts, follow each other and generate feed, focus only on these
- Save POSTS with GSI (createdBy, createdAt)
- Save FOLLOWING info as
  - (followingUser, followedUser), and
  - GSI (followedUser, followingUser)
  - NOTE: relation is still uni-directional
- Feed will read followed users and then post for those users, GSI from POSTS
- But not good for too many following, have a precomputed feed at the time of post creation
- For too many followers, they'll poll posts at generation
- For hot posts, add a cache aggressively
- Do not use CDN for posts
  - cause post id and signed visibility token is not available at that level close to user
  - also post content is not too much to put in CDN, images / videos are already in CDN

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/fb-news-feed)


## Instagram (Twitter + Youtube)

- For post creation, follow each other & feed, refer to twitter and FB news feed
- For post media delivery, follow Youtube
- Few additions on top of above design is below, feed storage and its update on follow/unfollow
- On unfollow, what happens with precomputed feed:
  - Put a task in queue, have background worker to maybe clean it
  - Slightly long persistent cache for unfollow events, and filter at feed generation
  - Offload instant filtering to client itself
- On follow:
  - Put the new user in celebrity list with a TTL
  - New posts will be part of precomputed feed
- For storing precomputed feed:
  - Store in Cassandra (append only), with key (readingUserId, createdAt)
  - Also have postId and creatorId (to accomodate unfollow)
  - For old post expiry use TTL in Cassandra
  - For seen posts, have a mix of cursors, heuristics like bloom filters
  - A solution for exact correctness, store all seen windows, merge them on overlap, but not worth it

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/instagram)
- [Meta's Tao](https://engineering.fb.com/2013/06/25/core-infra/tao-the-power-of-the-graph/)


## Web Crawler

- Crawl all efficiently under X days, so that can go again
- Crawl full web politely from seed urls, maybe have fetch rate-limiter based on domain
- Pull a url from queue, fetch, store, put on processing queue, process, store processed data
- Maintain url and domain level metadata
- For queue, use SQS as have retry and backoff
- For proper ordering and queueing of urls to be fetched
  - save domain wise url to be fetched in DB, to be picked periodically
- Estimate core crawler count based on network bandwidth
- Can do DNS caching, rate-limiting, round-robin bw providers
- For efficieny, do not crawl/process already crawled/processed page
  - have last crawl time in url
  - have html hash in row
- Have depth to avoid being trapped on a domain and keep crawling it

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/web-crawler)


## Top K YouTube videos

- Is K fixed or arbitrary?
- Tumbling window OR Sliding window?
- Last interval query OR Arbitrary interval query?
- Consume view events from Kafka
- Write DB entries batched by min, hour, day, month
  - By writing in same entry for min, hour, day, month, OR
  - Using Flink
  - Pre-calculate, top K for each window by a cron, for last interval and preserve
  - OR, add an index on (exactTimeWindow + views), where exactTimeWindow is which min, hour, day, ..., BUT writes will be bad then
  - OR, save and send data to a separate store to be sorted and then stored
- For scaling writes on DB, shard by videoId
- For sliding window, if fixed window then +new -last, if arbitrary, then long running query
- If approximations are allowed
  - Can use CountMinSketch (CMS) + current list of sorted top K (+ buffer)
  - Can be done by Flink

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/top-k)
