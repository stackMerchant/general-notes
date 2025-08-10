# Cassandra

## Cassandra Basics

### Data Model

Keyspace => 
- top-level organizational unit in Cassandra, equivalent to a "database" in RDBs
- defines replication strategies for managing data redundancy and availability
- owns user-defined-types (UDTs)

Table =>
- lives within a keyspace and organizes data into rows
- each table has a schema that defines its columns and primary key structure

Row => identified by a primary key

Column =>
- has a name, a type, and a value
- not all columns need to be specified per row like RDBs

### Primary Key
Every row is represented uniquely by a primary key, it consists of one or more partition keys and may include clustering keys

Partition Key => One or more columns that are used to determine what partition the row is in

Clustering Key => Zero or more columns that are used to determine the sorted order of rows in a table


## Key Concepts

### Partitioning
uses consistent hashing with vnodes (virtual nodes)

### Replication [Doc](https://docs.datastax.com/en/cassandra-oss/2.2/cassandra/dml/dmlTransactionsDiffer.html)
- keyspaces have replication configurations specified
- data replicated to next few vnodes (skips same physical node)
- has two different "replication strategies"
- NetworkTopologyStrategy, physical rack aware
- SimpleStrategy, use consistent hashing ring

### Consistency [Doc](https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html#tunable-consistency)
- No ACID, only supports atomic and isolated writes at the row level in a partition
- has quorum, data center based quorum too
- aims for "eventual consistency" for all consistency levels

### Query Routing
- when a client issues a query, it selects a node who becomes the coordinator, coordinator issues queries to nodes that store the data (a series of replicas)

### Storage Model & Read-Write
- core to its write throughput
- uses Log Structured Merge Tree (LSM tree) index instead of B-tree index like in PSQL, DynamoDB
- every create / update / delete is a new entry (with some exceptions)
- LSM tree enables Cassandra to efficiently understand the state of a row

3 constructs core to LSMT:
- Commit Log: this basically is a write-ahead-log to ensure durability of writes for Cassandra nodes
- Memtable: an in-memory, sorted data structure that stores write data, it is sorted by primary key of each row
- SSTable: aka "Sorted String Table", immutable file on disk containing data that was flushed from a previous Memtable

Write process: a Memtable houses recent writes, consolidating writes for a keys into a single row, and is occasionally flushed to disk as an immutable SSTable. A commit log serves as a write-ahead-log to ensure data isn't lost if it is only in the Memtable and the node goes down

Read process: for a particular key, Cassandra reads the Memtable first, which will have the latest data, if not, Cassandra leverages a bloom filter to determine which SSTables on disk might have the data, to get latest data

Writes are done at cell (row + column) level, so WAL and memtable contains cell updates
And to read all cells of a row (a key), it fetches all cols' latest data from SSTs
Writes are cell-level, cheap, append-only
Row reads are merge-based, pulling latest column values from multiple files

Also all these cell read-writes are in [partition][row][column]


Compaction: of SSTables periodically
SSTable Indexing: stores files that point to byte offsets in SSTable files

### Gossip
nodes routinely pick other nodes to gossip with, with a probabilistic bias towards "seed" nodes, eliminates the possibility that sub-clusters emerge

### Fault Tolerance
- Offline nodes are kept until node is decomissioned or rebuilt
- Hinted handoffs are used for brief offlines


## How to use Cassandra

### Data Modeling
- Partition Key: What data determines the partition that the data is on
- Partition Size: How big a partition is in the most extreme case, whether partitions have the capacity to grow indefinitely, etc.
- Clustering Key: How the data should be sorted (if at all).
- Data Denormalization - Whether certain data needs to be denormalized across tables to support the app's queries

### Example: Discord Messages [Doc](https://discord.com/blog/how-discord-stores-billions-of-messages)
Partitioned messages based on channel id, but partitions became huge
Introduced bucket in and new partition key => (channel_id, bucket)

### Example: Ticketmaster
Partition by events
Improve, partition by events + section
Denormalize aggregate data in separate table
Application's access patterns and UX have a heavy influence on how data is modeled in Cassandra


## Advanced Features
- Storage Attached Indexes (SAI) [Doc](https://cassandra.apache.org/doc/latest/cassandra/developing/cql/indexing/sai/sai-concepts.html)
- Materialized Views, like SQL views, except a real physical table that Cassandra maintains automatically based on changes to the base table [Doc](https://www.geeksforgeeks.org/sql/sql-views/)
- Search Indexing, can be wired up to a distributed search engine 


## In an Interview
- Systems that prioritize availability over consistency and have high scalability needs
- High write throughput
- Flexible and sparse schemas
- Not for strict consistency and advanced query patterns, such as multi-table JOINs, adhoc aggregations


## More Sources
- [B Trees](https://www.youtube.com/watch?v=K1a2Bk8NrYQ)
- [B Tree](https://www.youtube.com/watch?v=ownO77M4SWI)
- [B+ Trees](https://www.youtube.com/watch?v=o_2psWN8k_c&t=57s)
- [LSMT](https://www.youtube.com/watch?v=I6jB0nM9SKU)
- [More on it](https://hackernoon.com/how-cassandra-stores-data-an-exploration-of-log-structured-merge-trees)
- [LSMT](https://www.scylladb.com/glossary/log-structured-merge-tree/)
- [Service Discovery](https://middleware.io/blog/service-discovery/)
- [Taylor Swift Problem](https://www.educative.io/blog/taylor-swift-ticketmaster-meltdown)
- [DB Data Structures](https://www.youtube.com/watch?v=W_v05d_2RTo)
