# Uber

## Interview experiences


## E-commerce browsing

#### Uber | Software Engineer II (SE-2) | Bangalore | Interview Experience
- [Link](https://leetcode.com/discuss/post/7300207/uber-software-engineer-ii-se-2-bangalore-wyl8/)
- File system => split path into tokens, have a path resolver method
- Ecommerce recommendation system
    - Solution =>
    - Events -> Kafka -> Flink -> Redis & Clickhouse & S3
    - Kafka
        - partition key = productId
        - not becuase of ordering, but a product's events should be co-located
    - Flink
        - for say sliding window, store aggregated data queue for a productId for each min (adaptive windowing)
        - queue will have limited items, 1440 if storing each min
        - Flink will maintain a rolling score and update LOCAL top K accordingly
        - Merge local top k to get global top k
    - Redis
        - Flink will push complete top K on connection establishment, this will handle Redis going down
        - and later just top K updates
        - periodic full refreshes too
        - Idempotent writes
    - Clickhouse
        - Store aggregated events for maybe later analytics
    - S3 / Data lake
        - Raw events
    - Hot productIds
        - Split productId by adding suffix
        - Detect hot key dynamically and then split keys

#### Uber Interview Experience L4 (SDE2-Backend) | December 2024
- [Link](https://medium.com/@laxmankumarmegwal/uber-interview-experience-l4-sde2-backend-december-2024-da0f059c230e)
- Train and platforms management
- E-commerce browsing


## Uber Eats

#### Uber SDE-2 Interview Experience || L4 || Bangalore
- [Link]((https://leetcode.com/discuss/post/7182332/uber-sde-2-interview-experience-l4-banga-fd1d/))
- Train platform management
- Uber eats
    - Services => HomePage, Orders, Restaurant, Search
    - Data store => SQL + NoSQL (denormalized) + ElasticSearch
    - For analytics, events -> kafka -> flink (aggregate) -> Clickhouse

#### Uber India L5 (SSE) Interview experience
- [Link](https://leetcode.com/discuss/post/7166233/uber-india-l5-sse-interview-experience-b-txdo/)
- Meeting room booking
- Restaurant orders live aggregation + Top k
    - More granular, at restuarant and dish level
    - Store only 5 min window aggregation in Flink + Redis, rest store on Cassandra/Clickhouse and Redis
    - For final output, combine both
    - Still not realtime as Flink has 1 min aggregation window
    - Do SSE for live dashboard
        - At first load of dahsboard, load other window data from durable storage
        - And maintain current window data through SSE
        - Let client app handle eviction of unused window data and new window data storage
        - Also show the dashboard like, (window, data) for each level, not one number for each level

#### Uber L4 Interview Experience Ongoing
- [Link](https://leetcode.com/discuss/post/7196883/uber-l4-interview-experience-ongoing-by-xj5u8/)
- Job Scheduler
- Uber eats on train
    - Similar to normal uber eats, just that instead of using user location, use next station's location

#### [OFFER][ACCEPTED] UBER SDE2 09/21 IN-OFFICE Interview Experience
- [Link](https://leetcode.com/discuss/post/5938462/offeraccepted-uber-sde2-0921-in-office-i-kt6c/)
- Score leaderboard
- Uber eats feed

#### Uber Data Engineer - SDE 2 role
- [Link](https://leetcode.com/discuss/post/6286740/uber-data-engineer-sde-2-role-by-anonymo-jo2l/)
- Real time trending dish dashboard

#### Uber | L4 | SDE 2 | Bangalore | India | November 2021
- [Link](https://leetcode.com/discuss/post/1639865/uber-l4-sde-2-bangalore-india-november-2-lsh6/)
- Job scheduler, recurring, non-recurring
- Food delivery home page

#### Uber L4(SDE-2) Interview Experience
- [Link](https://leetcode.com/discuss/post/7406341/uber-l4sde-2-interview-experience-by-yvu-c9pg/)
- HLD - Top K order items


## Chat app

#### Uber | SSE | Hyderabad | Reject
- [Link](https://leetcode.com/discuss/post/2155206/uber-sse-hyderabad-reject-by-anonymous_u-8d0y/)
- Folder path
- Design Whatsapp

#### Uber Onsite Interview Experience
- [Link](https://leetcode.com/discuss/post/3281930/uber-onsite-interview-experience-by-anon-psan/)
- Morris traversal
- Chat app

#### Interview Experience: Uber SDE-2 (L4) | India | Offer
- [Link](https://roundz.substack.com/p/interview-experience-uber-sde-2-l4)
- Job Scheduler
- Facebook Messenger


## View Count System

#### Uber | SSE | Bangalore | L5-A
- [Link](https://leetcode.com/discuss/post/6628212/uber-sse-bangalore-l5-a-by-anonymous_use-0h6x/)
- LLD Round - Design Stock trading platform
- HLD Round - Design Youtube view count system
    - Event -> Kafka -> Flink -> Cassandra (time aggregated AOL) -> Clickhouse -> Cassandra (Durable total) -> Redis

#### Uber | SSE | Bangalore | L5-A
- [Link](https://leetcode.com/discuss/post/6628212/uber-sse-bangalore-l5-a-by-anonymous_use-0h6x/)
- Design Stock trading platform
- Design Youtube view count system


## Stock price notification

#### Uber | SDE 2 | Backend | Interview Exp
- [Link](https://leetcode.com/discuss/post/7193626/uber-sde-2-backend-interview-exp-by-anon-i2r9/)
- Hasmap with get, set, delete, getRandom
- Stock notification system

#### Uber | SDE-2 | Offer | Bangalore
- [Link](https://leetcode.com/discuss/post/4854590/uber-sde-2-offer-bangalore-by-anonymous_-2iel/)
- Design Facebook
- Design stock price indicator


## Others

#### [Uber - L5A] SSE interview experience
- [Link](https://leetcode.com/discuss/post/7043175/uber-l5a-sse-interview-experience-by-nik-qpdr/)
- Sliding window eviction
- Heat map
    - Heatmap thread on chatgpt
    - https://www.hellointerview.com/community/questions/driver-heatmap-backend/cmatifpty00whad086tfsq0nz
- Solution:
    - Events -> Kafka1 -> Flink -> Kafka2 -> ConnectionService (+Redis)
    - Kafka1 => 
        - location updates from drivers
        - topic city, partition by driverId
    - Flink =>
        - keyby(driverId)
        - emit delta if location changed
        - keyBy(cellId) to aggregate
        - push aggregates/color forward
        - handle intercity using fake edge cells
    - Kafka1 => cell updates part by cell, periodic non-update pushes too
    - ConnectionService
        - is a consumer
        - keeps updating local Redis
        - holds user connections
        - H-scaled
        - when comes up takes state from sibling ConnectionService
    - For zoom levels, save all level cells in ConnectionService, RAM_all_levels => (7/6) RAM_last_level

#### Uber Offer | SDE1, Hyderabad | June 2022 | Accepted
- [Link](https://leetcode.com/discuss/post/2253867/uber-offer-sde1-hyderabad-june-2022-acce-fzyk/)
- BookMyShow LLD/HLD

#### Uber | Onsite | SSE | US Remote
- [Link](https://leetcode.com/discuss/post/1671890/uber-onsite-sse-us-remote-by-anonymous_u-mmpp/)
- Aggregate on interval start-end
- Inverted index design

========================================================================

========================================================================

========================================================================

========================================================================

#### Uber || SDE-1 Interview Experience || On-campus
- [Link](https://leetcode.com/discuss/post/3657138/uber-sde-1-interview-experience-on-campu-o391/)
- Text editor

#### Uber SDE2 onsite Interview Experience | Bengaluru
- [Link](https://leetcode.com/discuss/post/5818447/uber-sde2-onsite-interview-experience-be-3165/)
- Car booking system

#### Uber | SDE 2 | Bangalore | July 2024 Offer
- [Link](https://leetcode.com/discuss/post/5655907/uber-sde-2-bangalore-july-2024-offer-by-0gm3l/)
- In memory logger

#### Uber | SDE-2 | Bengalore | Selected
- [Link](https://leetcode.com/discuss/post/2396265/uber-sde-2-bengalore-selected-by-anonymo-esx0/)

#### Uber | Software Engineer 1 (L3) | Bengaluru, India | Sept 2024
- [Link](https://leetcode.com/discuss/post/5994500/uber-software-engineer-1-l3-bengaluru-in-p0t1/)
- Car booking platform, efficient booking

#### Uber | SSE | Round 1
- [Link](https://leetcode.com/discuss/post/2031524/uber-sse-round-1-by-anonymous_user-rskh/)
- Brute force log processing (use cpp)

#### Uber SSE Phone Screen NY
- [Link](https://leetcode.com/discuss/post/2099405/uber-sse-phone-screen-ny-by-anonymous_us-zg5f/)
- Job Scheduler / Executor

#### Uber | Senior Software Engineer (SSE) Interview experience
- [Link](https://leetcode.com/discuss/post/6283963/uber-senior-software-engineer-sse-interv-oi97/)
- Room assignment based on event

#### Uber SSE (L5A) Phone Screen
- [Link](https://leetcode.com/discuss/post/7780436/uber-sse-l5a-phone-screen-by-anonymous_u-37am/)
- First one time visitor in O(1), use map + dll

#### Uber | SSE | Bangalore | L5-A
- [Link](https://leetcode.com/discuss/post/7224790/uber-sse-bangalore-l5-a-by-baburao1998-a3mt/)
- Vending machine

#### System Design | Uber | SSE
- [Link](https://leetcode.com/discuss/post/3378926/system-design-uber-sse-by-poffertjes-zcwr/)
- Start/end event and getAllActiveEvents

#### Uber | SSE | Hyderabad | September 2023
- [Link](https://leetcode.com/discuss/post/4137694/uber-sse-hyderabad-september-2023-by-ano-edqa/)
- Meeting scheduler
- Bank settlements

#### Uber | SSE | Technical Phone Round
- [Link](https://leetcode.com/discuss/post/7313588/uber-sse-technical-phone-round-by-get_si-w5km/)
- Water jug problem
- Manager reportee tree

#### Uber - SSE | Feb 2021 | Reject
- [Link](https://leetcode.com/discuss/post/1072586/uber-sse-feb-2021-reject-by-anonymous_us-alka/)
- Leetcode 2008, 1D DP

## Specific Questions

## LLD

## HLD
- Zomato
- Distributed kv store
- Recommendation system design
- Coupon system design

## See
- YT top K //

- Whatsapp forward
    - Identify/callout the customer/user and its needs or success or impact dependability
    - Maintainability
    - Explicit fault tolerance callouts, failure scenarios and recovery paths
    - Metrics and monitoring
    - Future evolution of product

- Heat map
- Elastic search
- Payment system for concepts
- Kafka / DDB / Cassandra
- Read all questions again, here
- Read all theory again
- Read all questions again, on HI
- Redis pub-sub

- Flink

- Bookmyshow
