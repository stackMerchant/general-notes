# Concurrency (by HelloInterview)

By [Hello Interview](https://www.hellointerview.com/learn/low-level-design/concurrency/intro)

## Intro

Concurrency starts with a basic fact: threads in the same process share memory

### The Toolbox:

#### Atomics
``` java
import java.util.concurrent.atomic.AtomicInteger;

AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();  // Thread-safe increment
```

#### Locks (mutexes)

``` java
synchronized (lock) {
    // Only one thread can be here at a time
    balance += amount;
}
```

#### Semaphores

``` java
import java.util.concurrent.Semaphore;

Semaphore permits = new Semaphore(5);  // Allow 5 concurrent operations
permits.acquire();  // Block if no permits available
try {
    doWork();
} finally {
    permits.release();  // Always release, even on exception
}
```

#### Condition Variables

``` java
synchronized (lock) {
    while (!condition) {
        lock.wait();  // Release lock and sleep
    }
    // Condition is now true
}
```

``` java
/* When you want to avoid waking every thread, want to wake only specific threads */

import java.util.ArrayDeque;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class BoundedQueue<T> {
  private final Queue<T> q = new ArrayDeque<>();
  private final int cap;
  private final ReentrantLock lock = new ReentrantLock();
  private final Condition notEmpty = lock.newCondition();
  private final Condition notFull = lock.newCondition();

  public BoundedQueue(int capacity) { this.cap = capacity; }

  public void put(T item) throws InterruptedException {
    lock.lock();
    try {
      while (q.size() == cap) {
        notFull.await();
      }
      q.add(item);
      notEmpty.signal();   // wake one consumer
    } finally {
      lock.unlock();
    }
  }

  public T take() throws InterruptedException {
    lock.lock();
    try {
      while (q.isEmpty()) {
        notEmpty.await();
      }
      T item = q.remove();
      notFull.signal();    // wake one producer
      return item;
    } finally {
      lock.unlock();
    }
  }
}
```

#### Blocking Queues

Or Array Blocking Queues for strict FIFO

``` java
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

BlockingQueue<Task> queue = new LinkedBlockingQueue<>(100);
queue.put(task);   // Blocks if queue is full
Task t = queue.take();  // Blocks if queue is empty
```


## Correctness

> Correctness is about preventing data corruption when multiple threads access shared state. Two threads both book the same seat. A counter that should be 1000 reads 847. A bank balance missing deposits. The danger isn't deadlock or performance, it's silently producing wrong results.

Solutions:
- Coarse-Grained Locking
    - Use for human triggered
    - Do not release early
    - Different lock objects issue
    - Read write lock, can use this too
- Fine-Grained Locking
    - Use for machine triggered
    - Deadloack, acquire lock in consistent order
- Atomic Variables
    - Can use for compare-and-swap (CAS), using while loop and compareAndSet(observed, updated), Optimistic Locking
    - Only for single simple variables
- Thread Confinement (Shared Nothing)
    - Each thread updates their assigned segments/namespaces/shards

Common Bugs:
- Check-Then-Act
    - Connection Pool
    - LRU Cache with Max Size
    - File Download Manager
    - Parking Lot
    - Singleton (Lazy Initialization)
- Read-Modify-Write
    - Hit Counter
    - Bank Account
    - Metrics Aggregator
    - Inventory System


## Coordination

> Coordination is about threads communicating and handing off work. One thread produces tasks, another consumes them. A service sends a request, another service processes it. How do independent execution paths signal each other without burning CPU or corrupting state?

Solve:
- Efficient waiting: sleep when there's no work, waking immediately when work arrives
- Backpressure
- Thread safety

Solutions:
- Shared State Coordination
    - Wait/Notify (Condition Variables), snippet below
    - Blocking Queue
        - Use the poison pill pattern for shutdown
- Message Passing Coordination (Actors)
    - It's just an object with a mailbox and a message handler, processes one by one
    - Use when many stateful entities (game servers, chat systems, trading platforms)
    - Distributes well in distributed systems
    - Issues: Mailbox overflow, Message ordering, Debugging, Request-response patterns

Common Problems:
- Process Requests Asynchronously
    - Image Upload Service
    - Payment Processing
    - Report Generation
- Handle Bursty Traffic
    - News Site
    - Email Campaign
    - Batch Job Completion
    - Webhooks

``` java
/* Snippet for Wait/Notify (Condition Variables) */

synchronized (lock) {
    while (!conditionIsMet()) {
        lock.wait();  // Releases lock, sleeps until notified, waits on lock object till lock.notify() is called
    }
    doWork();
    lock.notifyAll();  // Wakes all waiting threads on lock object
}
```

``` java
/* Snippet for Blocking Queue */

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class TaskScheduler {
    private final BlockingQueue<Runnable> queue = new LinkedBlockingQueue<>(1000); // Remember to use capacity

    public void submitTask(Runnable task) throws InterruptedException {
        queue.put(task); // Remember indefinite waiting
        // queue.offer(timeout); // Timeout and reject
        // queue.offer(); // Drop and log, no timeout, returns false immediately
    }

    public void workerLoop() throws InterruptedException {
        while (true) {
            Runnable task = queue.take(); // Remember indefinite waiting
            // Runnable task = poll(timeout); // Self-explanatory ig
            task.run();
        }
    }
}
```

``` java
/* Snippet for Actor */

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public abstract class Actor<T> {
    private final BlockingQueue<T> mailbox = new LinkedBlockingQueue<>();
    private volatile boolean running = true;

    public Actor() {
        Thread thread = new Thread(() -> {
            while (running) {
                try {
                    T message = mailbox.take();
                    onReceive(message);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });
        thread.start();
    }

    public void send(T message) {
        mailbox.offer(message);
    }

    protected abstract void onReceive(T message);

    public void stop() {
        running = false;
    }
}
```


## Scarcity

> Scarcity is about managing limited resources when demand exceeds supply. You have finite database connections, limited memory for buffers, or expensive resources that should only be created once. The constraint isn't correctness, it's that there simply aren't enough resources for everyone who wants one.

Solutions:
- Semaphores
    - uses OS primitives to put threads to sleep when no permits are available
    - then wakes them when permits are released
    - go-to for limiting concurrent operations
    - if exception, rleease in finally
- Resource Pooling (with Blocking Queue)
    - Expensive objects like DB connections
    - Can create objects upfront or lazily, prefer upfront to keep simple
    - Remember to use finite capacity and access timeouts

Common Problems:
- Limit concurrent operations (semaphore with N permits)
    - Rate-Limited API Wrapper
    - Image Processing Pipeline
    - Video Transcoding Service
- Limit aggregate consumption (semaphore with permits = resource units), 100MB bandwidth, 100 permits each for 1MB
    - In-Flight Data Limiter
    - Memory Budget for Buffers
- Reuse expensive objects (blocking queue of actual objects)
    - Database Connection Pool
    - GPU Task Scheduler
- Maximizing Utilization
    - Work stealing, handles uneven task distribution
    - Batching, amortizes coordination overhead
    - Adaptive sizing, adjusts pool capacity based on demand

