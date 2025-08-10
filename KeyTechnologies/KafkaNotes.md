# Notes from Confluent Kafka 101

## Basics of Kafka
Think in terms of events
It's a log not queue, messages keeps getting appended

### Topics
- core abstraction
- contains events/messages
- each message contains
  - key
  - value
  - timestamp
- messages are immutable
- create new topic for mutation
- log compaction and retention

### Partitions
- topic is split into multiple smaller logs called partitions
- Kafka's able to support millions of partitions across a cluster, thanks to KRaft (impl of Raft Algo, bye Zookeeper), makes it incredibly scalable

### Brokers
- a JVM server
- group of brokers forms a Kafka cluster
- servers that store data and handle all data streaming requests
- stores partitions of topics
- KRaft, a built-in system based on Raft consensus protocol, for managing metadata and coordinating the brokers

### Replication
- for durable and fault-tolerant
- leader follower
- leader automatically selected

### Producers
- client applications responsible for writing data to a Kafka cluster
- to configure a producer
  - bootstrap.servers: list of brokers that the producer can connect to, it only needs a few to discover the rest of the cluster
  - acks: level of acknowledgment required from brokers before considering a message successfully sent
- main objects in the API
  - KafkaProducer:  manages the connection to the cluster and handles message sending
  - ProducerRecord – represents message (key, value) and the topic it will be sent to, can set optional fields like timestamp, partition, and headers
- producer library handles much of the complexity
  - chooses which partition to send the message to, either through round-robin or by hashing the message key
  - manages retries, acknowledgments, and ensures idempotency (no duplicate writes)

## More stuff outside cluster

### Confluent Schema Registry
- not part of Apache Kafka
- standalone server (outside cluster) that stores and manages schemas for Kafka topics
- can interact via REST + API keys
- schema compatibility rules: forward, backward and full
- serialization formats: Avro, JSON Schema, Protobuf
- has compile time checks too

### Kafka Connect
- is a separate Kafka Connect cluster (JVMs) from Kafka Cluster
- like consumer-transform-producer logic in one component
- interact with outside components like databases, APIs, and SaaS tools, with pre-written code, or pre-built connector
- 2 types:
  - source connectors: outside data (another cluster, DB, CDC, events) in cluster
  - sink connectors: cluster data to outside (another cluster, DB, warehouse, S3)
- available for almost every integration
- Examples
  - database to search: MySQL (Debezium CDC Source) → Kafka → Elasticsearch Sink → real-time search UI
  - data lake ingestion: Kafka → S3 Sink → Athena/Presto queries
  - legacy integration: Mainframe/Oracle DB → Kafka → modern microservices

### Stream Processing
- Advanced consumers with basics already in place
- Transform, Filter, Join, Aggregate, Window, Query
- Apache Flink and Kafka Streams

### Apache Flink
- runs in its own distributed compute cluster, can use Kafka Connect
- for high volume of events
- real time stream processing
- 3 APIs
  - DataStream API (low level)
  - Table API (mid level)
  - SQL API (high level)
- has:
  - exactly once processing
  - stream and batch processing
  - User Defined Functions (UDFs)
  - Event Pattern Recognition
- we can stream data with SQL like querying or create a table and then query on that

### Kafka Stream
- for low to mid volume of events
- a Java library, not a separate cluster or service
- it is embedded inside the application



# Notes from Hellointerview

Importantly, you can use Kafka as either a message queue or a stream. Frankly, the distinction here is minor. The only meaningful difference is with how consumers interact with the data. In a message queue, consumers read messages from the queue and then acknowledge that they have processed the message. In a stream, consumers read messages from the stream and then process them, but they don't acknowledge that they have processed the message. This allows for more complex processing of the data.

Partition selection
1. Partition Determination
2. Broker Assignment

Append-only design benefits:
1. Immutability
2. Efficiency
3. Scalability

Leader-follower replication for durability and availability (leader handles both read/write):
1. Leader Replica Assignment
2. Follower Replication
3. Synchronization and Consistency
4. Controller's Role in Replication

## Pull based consumption
Consumers read messages from Kafka topics using a pull-based model
This pull approach was a deliberate design choice that provides several advantages: it lets consumers control their consumption rate, simplifies failure handling, prevents overwhelming slow consumers, and enables efficient batching

## In Interview
Use as a message queue or a stream

### Scalability

Distribute partitions and topics well
Horizontal Scaling With More Brokers
Partitioning Strategy

Handle hot partitions?
1. Random partitioning with no key
2. Random salting
3. Use a compound key
4. Back pressure
Basically try to distribute hot key

### Fault Tolerance and Durability
"acks=all" and replication factor

But what happens when a consumer goes down? It doesn't

When consumer fails:
1. Offset Management, consumer offsets are at partition level
2. Rebalancing

### Handling Retries and Errors
Producer retires, with idempotent
Consumer retries, put in retry topic, if still fails put in DLQ (by consumer)
Retry topic and DLQ are consumer specific, not cluster wide

### Performance Optimizations
Batching, compression, but best is partitioning strategy

### Retention Policies
7 days default, can increase/decrease but keep cost and performance in mind


## Sources
1. Confluent
2. Hellointerview
3. [gentlydownthe.stream](gentlydownthe.stream)

# Next
1. [Jordan's comparison](https://www.youtube.com/watch?v=_5mu7lZz5X4&t=13s)
2. [queues-vs-streams-vs-pubsub](https://eda-visuals.boyney.io/visuals/queues-vs-streams-vs-pubsub)


