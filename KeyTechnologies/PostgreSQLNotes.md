# PostgreSQL

## Core Capabilities & Limitations

### Read performance

Indexing
Basic primary key
Multi column / composite key
Generalized Inverted Index (GIN) -> full text search, like simple ElasticSearch
Has JSONB too, can use with GIN

Has PostGIS for spatial data, is incredibly powerful - it can handle:
- Different types of spatial data (points, lines, polygons)
- Various distance calculations (as-the-crow-flies, driving distance)
- Spatial operations (intersections, containment)
- Different coordinate systems

Can combine indexing, GIN, PostGIS for something like:
> Find all video posts within 5km of San Francisco that mention "food" in their content and are tagged with "restaurant"

Query optimisation essentials:
- Covering indexes: store data with index itself
- Partial indexes: index based on condition

Practical Performance Limits:

Query Performance:
- Simple indexed lookups: tens of thousands per second per core
- Complex joins: thousands per second
- Full-table scans: depends heavily on whether data fits in memory

Scale Limits:
- Tables start getting unwieldy past 100M rows
- Full-text search works well up to tens of millions of documents
- Complex joins become challenging with tables >10M rows
- Performance drops significantly when working set exceeds available RAM

### Write Performance

Upon write following happens for performance and durability:
- Transaction log (WAL) write [in DISK], sequential so very fast
- Buffer Cache Update [in Memory]
- Background Writer [Memory to Disk], async and batched
- Index updates [Memory & Disk], also additional WAL for index

Write performance is typically bounded by how fast you can write to the WAL (disk I/O), how many indexes need to be updated, and how much memory is available for the buffer cache

Throughput Limitations:
- Hardware, bottlenecked by disk I/O for the WAL
- Indexes
- Replication
- Transaction

Write Performance Optimizations:
- Vertical Scaling
- Batch processing
- Write offloading
- Table Partitioning, like by time
- Sharding, unlike DynamoDB, no built-in solution, do manually

### Replication
Provides sync and async replication
For:
- Scaling reads, "Read-Your-Writes" consistency issue
- High availability

### Data Consistency
Transactions, ensures atomicity (all or none)
For consistency across multiple concurrent transactions, will need locking
- Row level locking
- Higher isolation level
  PostgreSQL supports three isolation levels:
  - [Not in PG] Read uncommited
  - Read Committed (Default), prevents dirty reads i.e. reading uncommitted changes
  - Repeatable Read, creates consistent snapshot of data at transaction start; PostgreSQL's implementation prevents both non-repeatable reads AND phantom reads
  - Serializable, in sequence

Each isolation level solves following respectively and before in order:
Dirty reads, non-repeatable reads, phantom reads, serialization anomaly


## When to Use PostgreSQL
Start by it, devite if have strong reasons

### When to Consider Alternatives:

Extreme Write Throughput, millions of writes per sec:
- NoSQL databases (like Cassandra) for event streaming
- Key-value stores (like Redis) for real-time counters

Global Multi-Region Requirements:
- CockroachDB for global ACID compliance
- Cassandra for eventual consistency at global scale
- DynamoDB for managed global tables

Simple Key-Value Access Patterns:
- Redis for in-memory performance
- DynamoDB for managed scalability
- Cassandra for write-heavy workloads

Scalability alone is not a good reason to choose an alternative to PostgreSQL
PostgreSQL might not be the best fit, such as cases requiring extreme write scaling or global distribution, where databases like Cassandra or CockroachDB might be more appropriate


## Summary

ACID:
Atomicity (All or Nothing)
Consistency (Data Integrity)
Isolation (Concurrent Transactions)
Durability (Permanent Storage)

SQL Command Types:
DDL (Data Definition Language): CREATE TABLE, ALTER TABLE, DROP TABLE
DML (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE
DCL (Data Control Language): GRANT, REVOKE
TCL (Transaction Control Language): BEGIN, COMMIT, ROLLBACK


## DBs guide:
- MongoDB
- Redis
- Postgres
- Distributed SQL: Cockroach, Yugabyte
- NoSQL: DynamoDB, Scylla, Cassandra
- Analytics: ClickHouse, DuckDB, BigQuery
- Search: OpenSearch
- Time-series: Timescale, VictoriaMetrics
- Vector: PgVector, Milvus
