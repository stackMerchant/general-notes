# Redis

## Basics

Is a key-value store
Keys are strings, value can be any of following:
- Strings
- Hashes (objects/dictionaries)
- Lists
- Sets
- Sorted Sets (Priority Queues)
- Bloom Filters (probabilistic set membership; allows false positives)
- Geospatial Indexes
- Time Series

### Commands
Redis' wire protocol is a custom query language comprised of simple strings

### Infrastructure Configurations
Can run as a single node, with a high availability (HA) replica, or as a cluster
Choosing how to structure your keys is how you scale Redis
When operating as a cluster, Redis clients cache a set of "hash slots" which map keys to a specific node
This way clients can directly connect to the node which contains the data they are requesting

### Performance
O(100k) writes per second and read latency is often in the microsecond range


## Capabilities

1. Cache: Has TTL, Has hot-key problem
2. Distributed Lock: Have a key, if key is present somebody has a lock, after usage delete the key
More sophisticated locks in Redis can use the [Redlock algorithm](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/) together with fencing tokens if you want an airtight solution
3. Leaderboards
4. Rate limiting:
    - Fixed window (key for each window, with TTL)
    - sliding window (at request remove now - T events, then count, use Lua for atomic)
5. Proximity Search
6. Event Sourcing: Like kafka but small, non-durable use case
7. Pub/Sub:

## Shortcomings
Hot-key problem, have local cache at client


## Sources
1. HelloInterview

# Next
- [Build Your Own Redis](https://www.youtube.com/watch?v=B2JoBjrW-xA)
- [Use it better?](https://www.youtube.com/watch?v=WQ61RL1GpEE)
- [Redis Crash Course](https://www.youtube.com/watch?v=Vx2zPMPvmug&t=2172s)
- [ByteByteGo](https://www.youtube.com/watch?v=dGAgxozNWFE&ab_channel=ByteByteGo)
- [ByteByteGo](https://www.youtube.com/watch?v=5TRFpFBccQM&ab_channel=ByteByteGo)
- [ByteByteGo](https://youtube.com/watch?v=wh98s0XhMmQ&ab_channel=ByteByteGo)
- [ByteByteGo](https://www.youtube.com/watch?v=a4yX7RUgTxI)

