# Flink

## From Flink (Confluent tutorial)

#### Intro to Stream Processing

Four cornerstones of flink:
- Streaming
- State
- Time
- Snapshots

Terminologies
Job: A running flink application
The Job Graph (or Topology): data processing pipeline through which event data streams, always a DAG
Nodes in graph => processing steps => executed by operators => transforms event streams

Stream processing:
- Parallel
- Forward
- Repartition
- Rebalance

#### Flink SQL

Flink's APIs
- Flink SQL
- Table API (dynamic tables): declarative DSL
- Datastream API (streams, windows): stream processing and analytics
- Process functions (events, state, time): low-level stateful stream processing

Don't have tables, describe data that sits somewhere else
Instead has metadata which is schema and connector properties to deliver data to Job

Stream-Table duality
- has dynamic tables which change over time
- every table is eqv to changelog stream that describes those changes, changelog stream
- append only dynamic table
- might be updated, deleted, +I, -U, +U, -D

#### The Flink Runtime

- You write code using Flink API, you are client
- You then submit job to job manager using Flink API
- Job manager finds or spins up resources, Task Manager, to perform task

#### Using Kafka with Flink

Flink acts as a compute layer for Kafka
Powering real-time applications and pipelines

#### Stateful stream processing with Flink SQL

#### Checkpoints and Recovery

Checkpoint - automatic
Savepoint - manual

Chandy-Lamport distributed snapshot algorithm

The whole cluster restarts from last snapshot, not just failed node

#### Conclusion

Skipped:
- JOINs
- CDC
- Pattern matching


## Other sources


# Next
- [Flink-faker](https://github.com/knaufk/flink-faker) (try maybe)
- Confluent' website has multiple courses
- [Intro by AWS](https://www.youtube.com/watch?v=zhZCVbteZxI)
- [Some hands-on](https://www.youtube.com/watch?v=5mQ2NxmYa3M)
- [Comprehensive playlist](https://www.youtube.com/watch?v=U7XK1avbHS0&list=PLD6DcxwkW8BcbMSbNWeg_xKhS3kS5DQcB)
