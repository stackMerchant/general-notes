# More about DBs in general


## DB comparisons

| Database       | Primary Strength             | Sustained Throughput (TPS)                            | Latency (P99)              | Behavior Under Load                   | Best Use Cases                                  |
| -------------- | ---------------------------- | ----------------------------------------------------- | -------------------------- | ------------------------------------- | ----------------------------------------------- |
| **Cassandra**  | Maximum sustained throughput | **Writes:** 1M+<br>**Reads:** 500k+                   | High variance, tail spikes | Stays available, latency spikes       | Metrics, logs, events, write-heavy time-series  |
| **DynamoDB**   | Predictable latency          | **Writes:** 1M+ (partitioned)<br>**Reads:** 300k+     | **Very stable**            | Throttles early, fails fast           | Sessions, profiles, carts, low-latency services |
| **MongoDB**    | Flexible NoSQL + speed       | **Writes:** 100k–500k (sharded)<br>**Reads:** 200k–1M | Medium, cache-dependent    | Sudden slowdown if cache misses       | Content metadata, user data, general NoSQL      |
| **PostgreSQL** | Correctness & rich queries   | **Writes:** 5k–50k<br>**Reads:** 20k–100k             | Low–medium                 | Throughput collapses under contention | OLTP, transactions, joins, business data        |


#### One-line mental model:
- Cassandra: throughput-first
- DynamoDB: latency-first
- MongoDB: cache-first
- PostgreSQL: correctness-first


#### Compaction impact (Cassandra):
- Harmless for append-only, time-series data
- Very painful for update-heavy or tombstone-heavy workloads
- Main cause of tail latency spikes


## DBs list:
- MongoDB
- Redis
- Postgres
- Distributed SQL: Cockroach, Yugabyte
- NoSQL: DynamoDB, Scylla, Cassandra
- Analytics: ClickHouse, DuckDB, BigQuery
- Search: OpenSearch
- Time-series: Timescale, VictoriaMetrics
- Vector: PgVector, Milvus


## Sources
- [B Trees](https://www.youtube.com/watch?v=K1a2Bk8NrYQ)
- [B Trees](https://www.youtube.com/watch?v=ownO77M4SWI)
- [B+ Trees](https://www.youtube.com/watch?v=o_2psWN8k_c&t=57s)
- [LSMT](https://www.youtube.com/watch?v=I6jB0nM9SKU)
- [More on it](https://hackernoon.com/how-cassandra-stores-data-an-exploration-of-log-structured-merge-trees)
- [LSMT](https://www.scylladb.com/glossary/log-structured-merge-tree/)
- [Service Discovery](https://middleware.io/blog/service-discovery/)
- [Taylor Swift Problem](https://www.educative.io/blog/taylor-swift-ticketmaster-meltdown)
- [DB Data Structures](https://www.youtube.com/watch?v=W_v05d_2RTo)

