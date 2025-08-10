# Zookeeper

## Notes from HelloInterview

### Basics:

ZooKeeper provides a simple but powerful set of primitives that help solve complex distributed coordination problems

It is like a synchronized metadata filesystem — each node that's connected should have the same view of this data
This consistent view across all participating servers is what makes ZooKeeper so powerful for coordination tasks

Not for large scale cordination, think for servers not users

Three key concepts:
1. the data model based on ZNodes,
2. the server roles within a ZooKeeper ensemble, and 
3. the watch mechanism that enables real-time notifications

#### Data Model: ZNodes
ZNodes come in three main flavors:
1. Persistent ZNodes: These nodes exist until explicitly deleted
2. Ephemeral ZNodes: These are automatically deleted when the session that created them ends (whether through client disconnection or timeout), this is perfect for tracking which servers are alive and which users are online (use consistent hashing for large number of users)
3. Sequential ZNodes: These have an automatically appended monotonically increasing counter to their name, use this for ordering messages or implementing distributed locks

#### Server Roles and Ensemble
Group of servers called ensemble, contains leader & follower

#### Server Roles and Ensemble
Watches allow servers to be notified when a ZNode changes, eliminating the need for constant polling or complex server-to-server communication


### Key Capabilities

Configuration Management, Service Discovery, Leader Election, and Distributed Locks


### How ZooKeeper Works

#### Consensus with ZAB
Zookeeper Atomic Broadcast (ZAB) protocol, works in 2 phases:
1. Leader election (just latest changes)
2. Atomic broadcast

#### Strong Consistency Guarantees
1. Sequential Consistency
2. Atomicity
3. Single System Image
4. Durability
5. Timeliness

#### Read & write operations
Because reads are served locally by each server, it's possible for a client to read stale data if it connects to a follower that hasn't yet synchronized with the leader. For applications requiring the strongest consistency, ZooKeeper provides "sync" operations that ensure a server is up-to-date before performing a read.

#### Sessions and Connection Management
1. Session Establishments
2. Heartbeats
3. Session Recovery
4. Session Expiration

#### Storage Architecture
1. Transaction Logs
2. Snapshots
Periodically, ZooKeeper creates snapshots of its in-memory database to speed up recovery
When a server restarts, it loads the most recent snapshot and then replays transaction logs to recover the complete state

#### Handling Failures
1. Server failures
2. Network partitions
3. Client failures
4. Client session management


### ZooKeeper in the Modern World

#### Current Usage in Major Distributed Systems
Core part of ClickHouse, HBase, Hadoop, SolrCloud, Storm, NiFi, and Pulsar

#### Alternatives to Consider
etcd, Consul, Cloud Provider Solutions
With the rise of cloud-native solutions, many cloud providers offer built-in coordination services that abstract away the need for directly managing consensus systems like ZooKeeper. For example, in the AWS ecosystem, services like AWS ECS handle container orchestration through a centralized control plane, AWS CloudMap simplifies service discovery, and Amazon MSK provides ZooKeeper functionality as a fully managed service. These integrated solutions allow developers to focus on building applications rather than maintaining complex coordination infrastructure.

#### Limitations
1. Hot spotting issues: Many watchers for same ZNode
2. Performance limitations: quorum write so expensive, in-memory limitation
3. Operational complexity: simple to use but complex to operate

#### When to use
Smart routing
Deep infra design questions:
1. Distributed Messaging Queue
2. Distributed Task Scheduler
3. Durable Distributed Locks: Redis works, it is better when nested locks with watching is required

Not for large scale cordination, think for servers rather then users


## Sources
1. HelloInterview

# Next
1. [Some guy video 1](https://www.youtube.com/watch?v=gZj16chk0Ss&ab_channel=ddddd)
2. [Same guy video 2](https://www.youtube.com/watch?v=mhs73wTckwY&ab_channel=ddddd)
