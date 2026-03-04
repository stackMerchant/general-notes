Considerations for a core system:

So every system above TCP has its own protocol:
- DBs → custom binary protocol
- Kafka → custom binary protocol
- Web server → HTTP
They all parse the byte stream according to their rules.
Nagle’s Algorithm: accumulate till last packet ACK

Data reached socket buffers

How to handle network requests / or how data reached application from socket buffers:
- Request is parked in Socket buffers, OS tells thread/process/thread(IO-mux), then they read from socket buffer
- Process per connection (Postgres) (blocking)
- Thread per connection (MySQL) (blocking)
- IO Multiplexing, event loop  + workers (Kafka, Cassandra, Redis) (non-blocking)

What to do with request?

What/when to do in memory?
- Application level stuff
- Do not go in deadlock, livelock, OOM, have separate thread/worker pools

What/when to do on disk?
- Flow of data to/from disk? Zero copy? Kernel / User buffer? (fsync, sendfile, mmap)
- Use or skip OS page cache / kernel buffers / other OS optimizations
- Think about all buffers, socket, disk write, disk read

Are there any background workers?
- Like GC
- Flush to disk
- Checkpointing (Postgres, Flink)
- Their nature, “stop the world” or other?

Are there replay logs?

When to ack request? If distributed like (Kafka, Cassandra) then when?

Separate thread pools for separate work?
Lock or spin?
Syscalls count (futex)

Zero copy?
NIC (hardware, network interface card) → Kernel buffer → User buffer → Application
Each step can copy unless zero copy

Low-Latency Systems Core principles:
Avoid locks
Reduce context switches
Use async IO
Avoid syscalls
Avoid copies
Batch operations
Cache locality

When analyzing any system ask:
1. How does the thread wait?
2. How many threads exist?
3. Who wakes the thread?
4. Does kernel push events or do we poll?
5. Where are buffers?
6. How many memory copies?

