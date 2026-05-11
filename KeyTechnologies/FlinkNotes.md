# Flink

## From Flink (Confluent tutorial)

#### Intro to Stream Processing

Four cornerstones of flink:
- Streaming
- State
- Time
- Snapshots

Terminologies
- Job: A running flink application
- The Job Graph (or Topology): data processing pipeline through which event data streams, always a DAG
- Nodes in graph => processing steps => executed by operators => transforms event streams

OR
- Job → whole pipeline
- Operator → transformation step
- Subtask → parallel instance of operator
- Task → runtime execution unit for a subtask
- Task ~ Subtask

```
Flink Job
│
├── Source Operator
│     ├── Task 0
│     ├── Task 1
│     └── Task 2
│
├── Map Operator
│     ├── Task 0
│     ├── Task 1
│     └── Task 2
│
└── Sink Operator
      ├── Task 0
      ├── Task 1
      └── Task 2
```

Stream processing:
- Parallel
- Forward
- Repartition
- Rebalance

Key ideas:
- Forwarding, plain old forward
- Re-partitioning, shuffle
- Re-balancing, merge
- Broadcasting, through the cluster
- Join streams

#### Flink SQL

Flink's APIs
- Flink SQL
- Table API (dynamic tables): declarative DSL
- Datastream API (streams, windows): stream processing and analytics
- Process functions (events, state, time): low-level stateful stream processing

Idea:
- Don't have tables, describe data that sits somewhere else
- Instead has metadata which is schema and connector properties to deliver data to Job

Stream-Table duality
- has dynamic tables which change over time
- every table is eqv to changelog stream that describes those changes, changelog stream
- append only dynamic table
- might be updated, deleted, +I, -U, +U, -D

#### The Flink Runtime
- Job manager
- Task Manager
- You write code using Flink API, you are client
- You then submit job to job manager using Flink API
- Job manager finds or spins up resources, Task Manager, to perform task
- Task manager has task slots to run operators

#### Using Kafka with Flink

Flink acts as a compute layer for Kafka
Powering real-time applications and pipelines

#### Stateful stream processing with Flink SQL

#### Event time and Watermarks
- 2 times => event time and processing time
- Not required for batch processing and if using processing time
- Watermarks are a way to tell event based operators (like windows) to do their thing
- Provides control over the tradeoff b/w completeness and latency
- Watermark is mostly a trigger to close/fire the window (if windowing)
- Handles out or orderness by having a OOO allownace time
    - In heatmap, use processing time as there is no aggregation
    - In Uber eats, use watermarks to signal for aggregation
- Idle source issue, a source with no event will not give any watermark, solution:
    - Rebalance so that no partition has no events
    - Keep-alive events
    - Some kind of idleness detection

#### Checkpoints and Recovery
- Checkpoint - automatic
- Savepoint - manual
- Chandy-Lamport distributed snapshot algorithm
- Can process an event 1+ times, but guarantees exactly once effect
- The whole cluster restarts from last snapshot, not just failed node

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
