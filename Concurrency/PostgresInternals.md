PostgreSQL

Network request handling
Postgres => process per connection
MySQL => thread per connection

Connection pooling is used so thread process doesn’t matter, if anything, process is preferred
All client connections (including ones in same connection pool) connect via different ip+port, to a same server ip+port
Inside Postgres 

Postgres is preferred because:
Stronger standards compliance
More advanced query planner
Better extensibility
Rich indexing (GIN, GiST, BRIN)
JSON support
Advanced concurrency (MVCC implementation)

Architecturally:
Process model gives strong crash isolation
Simpler memory safety (no shared memory corruption)
Historically very stable

base/ → table & index files
pg_wal/ → write-ahead logs
pg_xact/ → transaction status

Table  -> Segment files -> 8KB pages

A table will have multiple segment files if size goes beyond 1GB

Each page has
- PageHeaderData (wal ids, up down pointer data, etc)
- Line pointers (going down from up)
- Tuples going (going up from down)

Tuples are referred through (pageId + line pointer)

Toast? store large columns separately

Free Space Map (FSM)
Entries are entered through consulting FSM and then filling pages
Tuples can be in any order in any page

Shared buffers => cached pages in memory, self managed instead of relying on OS page cache
OS page cache, used by PG too

Each cached page contains meta data too, called Buffer Descriptor, they are:
- dirty flag, whether page data matches disk data
- LSN (Log Sequence Number), pointer to last WAL log applied to this page
- pin count, being used or not
- usage count, for LRU equivalent
- Lock info
- Relation info

On write
- FSM gives a free page from memory
- Data is written to that page and marked dirty
- then a WAL entry is generated with this page info
- WAL is flushed to disk (fsync)
- Locks released (plethora/heirarchy of locks, row level, table level, other lightweight or heavy weight locks, depends on query)
- ACK to user

WAL flush should cause latency? Group commits

Other techniques:
- Write coalescing, OS does it for you
- Transaction pooling
- Connection pooling
- Turn off fsync for ACK, and lose some data, synchronous_commit = off

Who flushes pages?
- Background writer, periodically flush, to avoid Checkpoint Storm
- Checkpointer, flush all now, add checkpoint entry in WAL to tell all before this is done 

Now, MVCC
- Each written tuple also has xmin & xmax, created and deleted transactions
- So queries know whether to consider it or not

Crash recovery =>
- play WAL from last checkpoint
- ignore un committed transactions

Vacumm, basically cleaning

TLB (Translation Lookaside Buffer)
- A small, fast cache that stores recent virtual-to-physical address translations from the page table
- Speeds up memory access by avoiding repeated page table lookups
- If a translation isn’t in the TLB, a TLB miss occurs, and the system must look up the page table (slower)

Updates

New tuple gets added, with new line pointer, updates xmax of THE ONLY old visible tuple
While read, tuple visibility is calculated based on transaction state in pg_xact
A transaction can see its own tuples, even if uncommitted

HOT (Heap-Only Tuple) update, optimisation by db

Indexing on updates
- if non-indexed column is updated, nothing happens, a HOT update
- else, generate new key and point it to new tuple, and then add it to index tree
- now pay attention, old key remains too in the tree, but the tuple is invisible due to xmax


//
Memory management:
Paging
TLB
Page faults
mmap
//

