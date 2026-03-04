# PostgreSQL


## Other basics

#### Network request handling
- Postgres => process per connection
- MySQL => thread per connection
- Connection pooling is used so thread / process doesn’t matter, if anything, process is preferred
- All client connections (including ones in same connection pool) connect via different ip+port, to a same server ip+port inside Postgres 

#### Postgres is preferred because:
- Stronger standards compliance
- More advanced query planner
- Better extensibility
- Rich indexing (GIN, GiST, BRIN)
- JSON support
- Advanced concurrency (MVCC implementation)

#### Architecturally:
- Process model gives strong crash isolation
- Simpler memory safety (no shared memory corruption)
- Historically very stable


## Data

#### Locations
- base/ → table & index files
- pg_wal/ → write-ahead logs
- pg_xact/ → transaction status

#### Data arrangement
- Table -> Segment files -> 8KB pages
- A table will have multiple segment files if size goes beyond 1GB
- Each page has
    - PageHeaderData (wal ids, up down pointer data, etc)
    - Line pointers (going down from up)
    - Tuples going (going up from down)
    - Tuples are referred through (pageId + line pointer)
- Toast? store large columns separately

#### Buffers / Caches
- Shared buffers => cached pages in memory, self managed instead of relying on OS page cache
- OS page cache is used too by PG

#### Buffer Descriptor
- each cached page's meta data, they are
- dirty flag, whether page data matches disk data
- LSN (Log Sequence Number), pointer to last WAL log applied to this page
- pin count, being used or not
- usage count, for LRU equivalent
- Lock info
- Relation info


## Write

#### On write
- FSM (Free Space Map) gives a free page from memory
- Data is written to that page and marked dirty
- then a WAL entry is generated with this page info
- WAL is flushed to disk (fsync)
- Locks released (plethora/heirarchy of locks, row level, table level, other lightweight or heavy weight locks, depends on query)
- ACK to user
- Note: Tuples can be in any order in any page

#### WAL flush should cause latency?
- Group commits
- Other techniques below:
    - Write coalescing, OS does it for you
    - Transaction pooling
    - Connection pooling
    - Turn off fsync for ACK, and lose some data, synchronous_commit = off

#### Who flushes pages?
- Background writer, periodically flush, to avoid Checkpoint Storm
- Checkpointer, flush all now, add checkpoint entry in WAL to denote all txn before this are processed

#### Now, MVCC
- Each written tuple also has xmin & xmax, created and deleted transactions
- So queries know whether to consider it or not

#### Crash recovery
- play WAL from last checkpoint
- ignore un committed transactions


## Update

#### Basics
- New tuple gets added, with new line pointer, updates xmax of THE ONLY old visible tuple
- While read, tuple visibility is calculated based on transaction state in pg_xact
- A transaction can see its own tuples, even if uncommitted
- HOT (Heap-Only Tuple) update, optimisation by db

#### Indexing on updates
- if non-indexed column is updated, nothing happens, a HOT update
- else, generate new key and point it to new tuple, and then add it to index tree
- now pay attention, old key remains too in the tree, but the tuple is invisible due to xmax

## Others

#### Vacumm
- basically cleaning
