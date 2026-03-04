## Considerations for a core system

## Start from network layer

#### So every system has its own protocol above TCP:
- DBs → custom binary protocol
- Kafka → custom binary protocol
- Web server → HTTP
- They all parse the byte stream according to their rules
- Nagle’s Algorithm: accumulate till last packet ACK

#### Data reached socket buffers

#### How data reaches application from socket buffers:
- Request is parked in Socket buffers, OS tells thread/process/thread(IO-mux), then they read from socket buffer
- Process per connection (Postgres) (blocking)
- Thread per connection (MySQL) (blocking)
- IO Multiplexing, event loop + workers (Kafka, Cassandra, Redis) (non-blocking)

## What to do with request?
- What in memory
- What/when on disk, and disk IO?
- When to ack request? If distributed like (Kafka, Cassandra) then when?

#### What/when to do in memory?
- Application level stuff
- Do not go in deadlock, livelock, OOM
- Have separate thread/worker pools for separate work, like DB pool, 3rd party, or some calculation pool

#### What/when to do on disk? OR Disk IO
- Flow of data to/from disk?
    - Zero copy?
        - NIC (hardware, network interface card) → Kernel buffer → User buffer → Application
        - Each step can copy unless zero copy
    - Kernel buffers / User buffers?
    - fsync, sendfile, mmap
- Use or skip OS page cache / kernel buffers / other OS optimizations
- Think about all buffers, socket, disk write, disk read

#### Are there any background workers?
- Like GC
- Flush to disk
- Checkpointing (Postgres, Flink)
- Their nature, “stop the world” or other?

#### Are there replay logs?
#### Separate thread pools for separate work?

## Other Questions

#### When analyzing any system ask:
1. How does the thread wait?
2. How many threads exist?
3. Who wakes the thread?
4. Does kernel push events or do we poll?
5. Where are buffers?
6. How many memory copies?

#### Low-Latency Systems Core principles:
- Avoid locks (Lock or spin?)
- Reduce context switches
- Use async IO
- Avoid syscalls (futex)
- Avoid copies
- Batch operations
- Cache locality
