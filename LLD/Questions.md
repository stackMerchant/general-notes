LLD Questions

Questions:
Design rate limiter // user to Counter class concurrent hash map	, token bucket with refill on read
Design a thread-safe LRU cache // coarse grained
Design in-memory key-value store // concurrent hashmap
Above with persistence // postgres stuff, in-memory write + WAL + flush later
Design connection pool // create connection lazy/upfront, blocking Q or Q + lock + condition
Thread pool // BQ of Runnables + List of workers (extends thread)
Design task/job scheduler // min heap with timestamp
Circular buffer // head + tail, no contention in spsc just use volatile, for mpmc can use atomic (CAS)
Simple memory allocator
Design bounded blocking queue // start with coarse lock, then 2 locks + CAS
In memory file system // folder level lock
Logger // BQ or use cyclic buffer CAS + volatile

This tests:
Concurrency
Memory awareness
API clarity
Edge cases

More questions:

Chapter 1. Web Crawler
* Implement a web crawler. Follow-up: Do this with multithreading
* Focus: BFS, practical multithreading
Chapter 2. Rate Limiters
* Implement various types of rate limiters
* Focus: Fluent use of arrays
Chapter 3. Chat App: Design a functional chat client & server
Chapter 4. Data Storage: Banking System With Transactions
* CRUD operations on in-memory key-value stores
* Focus: Dictionaries & use of states to represent transactions
Chapter 5. Relational Database: Implementing SQL
* CRUD operations on an in-memory tabular data structure.
* Focus: Fluent use of arrays or dictionary operations
Chapter 6. Non-Relational Database: Key Value Stores with Persistence
* CRUD operations on in-memory key-value store with a snapshot ability
* Focus: Implementing a write-ahead log, or implementing snapshot functionality.
Chapter 7. Simple Kubernetes Job Scheduler
* Simulate a simplified Kubernetes Scheduler.
* Focus: Dictionary, array manipulation.
Chapter 8. File System: cd, pwd, mkdir, grep commands
* Implement a class to represent a file system. Follow up with implementing various navigation CLI commands such as cd, pwd, mkdir, grep.
* Focus: Tree structure, dictionary, BFS / DFS
Chapter 9. Logging System - Log Aggregator
* Given a potentially out-of-order log of some sort of transaction logs
* Focus: Arrays, Binary search, bisecting
Chapter 10. Iterator / Snapshot Set: TL;DR Iterator on lists, many ways
Chapter 11. Functional Data Pipelines
* Implement a class that allows callers to specify a chain of map(fn) and reduce(fn) functions, and execute lazily.

