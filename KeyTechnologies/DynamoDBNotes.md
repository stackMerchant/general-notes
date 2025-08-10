# DynamoDB

## Intro
- Fully-managed by AWS
- Highly scalable
- Key-value service

## The Data Model
- Tables: top-level data structure, each defined by a mandatory primary key that uniquely identifies its items, supports secondary indexes
- Items: correspond to rows in rdb, contain a collection of attributes, must have a primary key
- Attributes: key-value pairs that constitute the data within an item

### Partition Key and Sort Key
- Primary key = Partition Key + Sort Key
- Consistent Hashing for Partition Keys
- B-trees for Sort Keys
- Composite Key Operations: first uses the partition key's hash to find the right node, then uses the sort key to traverse the B-tree and find the specific items

### Secondary Indexes
if you need to query your data by an attribute that isn't the partition key

Global Secondary Index (GSI):
- index with a partition key and optional sort key that differs from the table's partition key
- since GSIs use a different partition key, the data is stored on entirely different physical partitions from the base table and is replicated separately
- updated async from base table

Local Secondary Index (LSI):
- an index with the same partition key as the table's primary key but a different sort key
- since LSIs use the same partition key as the base table, they are stored on the same physical partitions as the items they're indexing
- updated sync with base table

### Accessing Data
- Scan Operation: Reads every item in a table or index and returns the results in a paginated response
- Query Operation: Retrieves items based on the primary key or secondary index key attributes
- Accesses entire item, so be mindful of width of an item (row)


## CAP Theorem

Eventual Consistency (Default):
- highest availability and lowest latency, but it can result in stale reads
- AP system displaying BASE properties

Strong Consistency:
- higher latency and potentially lower availability
- CP system displaying ACID properties


## Misc
- Architecture and Scalability: auto-sharding and load balancing, high availability and fault tolerance
- Security: encryption at rest and transit
- Pricing: RCU & WCU


## Advanced Features
- DAX (DynamoDB Accelerator), in-built cache [Doc](https://aws.amazon.com/blogs/database/amazon-dynamodb-accelerator-dax-a-read-throughwrite-through-cache-for-dynamodb/)
- Streams: CDC


## In an Interview
- highly scalable, durable, supports transactions, and offers sub-millisecond latencies
- even supports ACID properties and transactions

Limitations:
- Cost at scale
- Complex Query Patterns
- Data Modelling Constraints: if using GSI and LSI a lot, use RDB
- Vendor lock-in


## More Sources
- [Re-invent](https://www.youtube.com/watch?v=csvPepC6tKk)
- [Re-invent](https://www.youtube.com/watch?v=Qzs8mU5dgx4)
