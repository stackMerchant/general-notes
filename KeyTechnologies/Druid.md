# Druid and its place

### 1. Apache Druid: The Serving Layer
*   **Definition:** A high-performance, columnar analytics database designed for sub-second queries on massive datasets.
*   **Strength:** **Slicing and Dicing.** It allows users to filter, group, and aggregate trillions of rows of time-series data instantly.
*   **Limitation:** It is **append-only**. It cannot handle "point updates" (editing a single row) or complex joins efficiently.

---

### 2. The Streaming Architecture
A standard high-scale pipeline follows this flow:
`Source` → `Kafka` → `Flink` → `Kafka` → `Druid`

*   **Kafka (The Buffer):** Acts as the "handshake" between systems. Druid uses a **Pull Model** to consume from Kafka at its own pace, ensuring stability and "exactly-once" data delivery.
*   **Flink (The Processor):** The "Translator." It cleans data, joins different streams, and handles complex math/alerts *before* the data lands in storage.
*   **Druid (The Library):** The "Historical Brain." It stores the cleaned data for long-term exploration and high-concurrency dashboards.

---

### 3. Key Comparisons

| System | Role | Why use it over the others? |
| :--- | :--- | :--- |
| **Redis** | Cache | Use for microsecond lookups of specific keys; too expensive for massive history. |
| **ClickHouse** | OLAP | Excellent raw "brute force" speed; better for ad-hoc internal data science. |
| **BigQuery** | Warehouse | Best for complex business logic and "cold" historical storage; slower than Druid. |
| **Druid** | OLAP | Best for **high-concurrency**, user-facing dashboards with native Kafka ingestion. |

---

### 4. Summary: Slicing vs. Dicing
*   **Slicing:** Filtering by one dimension (e.g., "Only show data for 2026").
*   **Dicing:** Filtering by multiple dimensions (e.g., "2026" + "London" + "Mobile Users").
*   **The Goal:** Fast exploration of "hot" data without the latency of a traditional warehouse or the cost of an all-RAM system.