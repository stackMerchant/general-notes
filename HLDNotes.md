# HLD Question Notes


## Google Docs

- Document meta data flow
- Separate flow for write on Cassandra with WS

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/google-docs)
- [NeetCode](https://www.youtube.com/watch?v=9JKBlkwg0yM&t=2152s)
- [Jordan](https://www.youtube.com/watch?v=YCjVIDv0zQY&t=2695s)


## Ad click aggregator

- Vend ad meta data
- [Approach 1] Click -> Cassandra -> Spark -> OLAP -> Analytics Query
- [Approach 2] Click -> Kafka -> Flink -> OLAP -> Analytics Query (Kappa)
- [Approach 3] Approach 1 + 2, realtime + periodic reconciliation (~ Lambda)
- Lambda: “Stream for now, batch for truth.”
- Kappa: “The log is truth; replay when needed.”

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/ad-click-aggregator)


## Live Comments

- [Approach 1] Write to DynamoDB -> PubSub -> SSE
- [Approach 2] Write to DynamoDB -> Dispatch event -> Colocated user servers -> SSE
- [Approach 3] Write to Kafka -> DynamoDB write consumer -> PubSub consumers with colocated users -> SSE

#### Sources
- [Hello interview](https://www.hellointerview.com/learn/system-design/problem-breakdowns/fb-live-comments)

