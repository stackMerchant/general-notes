# HLD Question Notes


## Google Docs

- Document meta data flow
- Separate flow for write on Cassandra with WS

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/google-docs)
- [NeetCode](https://www.youtube.com/watch?v=9JKBlkwg0yM&t=2152s)
- [Jordan](https://www.youtube.com/watch?v=YCjVIDv0zQY&t=2695s)


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


## URL shortener (like Bit.ly)

- Use global counter (with bijective mapping) -> put in DB -> read through cache
- Explore custom url, expiration time, 301/302, separate read/write service as skewed towards read

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/bitly)


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


## 

