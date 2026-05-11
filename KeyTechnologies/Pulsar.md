# Apache Pulsar vs. Apache Kafka: Key Differences & Comparison

## 1. Core Architecture
* **Kafka (Monolithic):** Couples serving (Brokers) and storage (Local Disk). Scaling one requires scaling the other.
* **Pulsar (Layered/Cloud-Native):** Decouples serving (**Stateless Brokers**) from storage (**Bookies/BookKeeper**).

## 2. Scaling Comparison
* **Kafka:** Adding brokers requires **rebalancing** (physically moving data partitions across the network). This is IO-intensive and slow.
* **Pulsar:** Adding storage is instant. New data segments are simply written to the new node. No historical data moves.
* **Independence:** Pulsar allows scaling CPU (Brokers) and Disk (Bookies) independently.

## 3. Key Features
| Feature | Kafka | Pulsar |
| :--- | :--- | :--- |
| **Multi-tenancy** | Difficult; often requires separate clusters. | Native; built-in Tenant/Namespace hierarchy. |
| **Messaging Models**| Strictly Log-based streaming. | Hybrid: Streaming + Shared Queuing (RabbitMQ-style). |
| **Tiered Storage** | Newer/Plugin-based. | Native; auto-offloads old data to S3/GCS. |
| **Complexity** | Lower (Single process with KRaft). | Higher (Manages Brokers, BookKeeper, and ZooKeeper). |

## 4. Maintenance & Operations
* **Kafka is simpler to start:** Fewer moving parts and a massive community for troubleshooting.
* **Pulsar is easier to grow:** Eliminates the "rebalancing nightmare" at high volumes and simplifies Kubernetes deployments due to stateless brokers.

## 5. Managed Services
* Pulsar is not currently a first-party service on AWS/GCP (unlike MSK or Pub/Sub).
* **Primary Providers:** **StreamNative** (creators of Pulsar) and **DataStax (Astra Streaming)**.
* Available via Marketplaces on AWS, Azure, and GCP.