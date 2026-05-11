# Coupon Management System – HLD Notes

## 1. Problem Overview

* Build a scalable coupon system with:

  * Coupon CRUD
  * Application at checkout based on conditions
* Constraints:

  * Millions of coupons
  * Low latency (~10–50 ms)
* Core challenge:

  * Efficient retrieval, not storage

---

## 2. Key Design Principle

* Treat system as:

  * **Rule Engine + Indexing Layer**
* Avoid scanning all coupons
* Use **precomputed indexes + filtering**

---

## 3. Data Modeling

### 3.1 Raw Coupon (Source of Truth)

* Stored in DB (DynamoDB / Cassandra)

```json
{
  "coupon_id": "C123",
  "type": "percentage",
  "conditions": [...],
  "valid_from": "...",
  "valid_to": "...",
  "usage_limit": 10000
}
```

---

### 3.2 Flattened Fields (for Indexing)

```json
{
  "coupon_id": "C123",
  "category_conditions": ["electronics"],
  "min_cart_value": 1000,
  "user_segments": ["prime"]
}
```

---

### 3.3 Design Choice

* Avoid fully dynamic `conditions[]` for querying
* Use **controlled schema with optional fields**
* Missing fields allowed (sparse data)

---

## 4. Database Characteristics

### DynamoDB

* Schema-less
* Supports nested JSON (Map/List)
* No efficient querying on nested fields

### Cassandra

* Fixed schema
* Sparse rows allowed (null/missing columns)
* Limited querying on nested data

### Conclusion

* Nested JSON: good for storage
* Flattened fields: required for querying

---

## 5. Indexing Strategy (Core)

### Inverted Index Model

Examples:

```
category:electronics → [C1, C5]
user_segment:prime   → [C1, C8]
cart_value:1000+     → [C4, C5]
```

---

### Storage for Indexes

* Redis (primary)
* Elasticsearch (optional, for complex queries)

---

## 6. Retrieval Flow (Checkout)

1. Extract cart features:

   * categories
   * cart value
   * user segment

2. Fetch candidate sets:

   ```
   S1 = category match
   S2 = cart value match
   S3 = user segment match
   ```

3. Intersect sets:

   ```
   eligible = S1 ∩ S2 ∩ S3
   ```

4. Final evaluation:

   * Validate full conditions
   * Check expiry, usage limits

---

## 7. Write Path (CRUD + Indexing)

### Pattern

```
Write DB → Emit Event → Async Index Update
```

---

### CDC / Event Options

* Native:

  * DynamoDB Streams
  * Cassandra CDC
* Application-level:

  * Kafka events

---

### Index Consumers

* Update Redis sets
* Update Elasticsearch (optional)

---

## 8. Why Async Indexing?

Avoid:

```
DB write + Redis + Elastic (sync)
```

Problems:

* High latency
* Partial failures
* Tight coupling

Use:

* Async pipeline
* Eventual consistency

---

## 9. Handling Updates & Deletes

### Update

* Remove old index entries
* Add new entries

### Delete

* Remove from all indexes

---

## 10. Consistency Model

* Eventual consistency
* Small delay between DB and index
* Acceptable for coupon systems

---

## 11. Idempotency

* Index updates must be idempotent

Example:

```
SADD key coupon_id
```

---

## 12. Handling New Conditions

### Risk

* Hardcoded schema → breakage

---

### Solution: Extensible Design

#### Storage

* Add new optional fields safely

#### Indexing

* Use pluggable handlers:

  ```
  Map<ConditionType, IndexHandler>
  ```

#### Evaluation

* Generic rule engine:

  ```
  for condition in coupon:
      evaluate(condition)
  ```

---

### Hybrid Approach

* Indexed fields → fast filtering
* Raw conditions → flexible evaluation

---

## 13. Backfill Strategy

* When adding new condition/index:

  ```
  Scan DB → rebuild indexes
  ```

---

## 14. Scaling Considerations

* Partition by region/tenant
* Use caching for hot coupons
* TTL for expired coupons
* Limit candidate set size

---

## 15. Final Architecture

```
DB (source of truth)
        ↓
   CDC / Events
        ↓
 Index Builders
   ↓        ↓
Redis   Elasticsearch (optional)
        ↓
   Checkout Service
        ↓
  Rule Evaluation Engine
```

---

## 16. Key Takeaways

* Do not query raw coupons at checkout
* Use inverted indexes for filtering
* Keep schema controlled but flexible
* Use async CDC for index updates
* Design for extensibility from day one
