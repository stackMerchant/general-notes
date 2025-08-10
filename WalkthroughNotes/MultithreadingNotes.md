## Multi threading / Concurrency


https://leetcode.com/discuss/post/341504/uber-implement-scheduledexecutorservice-c1zqg/
https://akhiilgupta.medium.com/design-a-multi-threaded-task-scheduler-lld-multi-threaded-construct-eb090c5a8727
https://medium.com/@choudharys710/lld-machine-coding-with-implementation-job-scheduling-system-real-time-4331bdd4607f
https://medium.com/javarevisited/i-found-leetcode-for-system-design-and-its-awesome-1e9ae36d24d2
https://www.youtube.com/watch?v=D3XhDu--uoI&t=2757s&ab_channel=Concept%26%26Coding-byShrayansh


Java multi threading:

Engineering Digest series
https://www.youtube.com/watch?v=091vJWjl1A4&list=PLA3GkZPtsafYhmrZR_1nmQqfFSnkftOud

Notes:

Program, process, thread
Multitasking => multiple processes
Multithreading => multiple threads

Thread states (5):
New
Runnable
Running
Blocked / Waiting
Terminated

Thread t = new Thread(runnable) // or extend runnable
run() // implement run method in thread or runnable

t.start()
t.join()
t.setPriority()
t.interrupt()
t.setDaemon(true)

Thread.sleep()
Thread.yield()

Thread.currentThread.getName()
Thread.currentThread.getState()
Thread.currentThread.getPriority()
Thread.currentThread.interrupt()

synchronized // takes lock on object
synchronized(this) // block sync
Critical section
Race condition
Mutual exclusion

Intrinsic locks // by using synchronized
Explicit locks // by using Lock class

Lock lock = new ReentrantLock();
lock.lock() // waits till it gets lock
lock.tryLock() // if gets lock fine else goes away
lock.tryLock(time) // waits till time to get lock
lock.unlock()
lock.lockInterruptibly()

ReentrantLock locks again

Lock lock = new ReentrantLock(fair = true); // ensure fairness, threads will get in the order of ask and there will be no starvation

Limitations of synchronized:
No fairness
Indefinite blocking
No interruptibility
No read write locking

Lock lock = new ReentrantReadWriteLock();

Conditions for deadlock:
Mutual exclusion
Hold and wait
No preemption
Circular wait

Thread communication: wait(), notify(), notifyAll()
Thread safe

Single abstract method class/interface like Runnable can be created using lambda expression

Thread pool:
Resource management
Response time
Control on thread count

Executor Framework:

Solving following issues:
Manual thread management
Resource management
Scalability
Thread reuse
Error handling

3 main things => Executor, ExecutorService, ScheduledExecutorService

ExecutorService executor = Executors.newFixedThreadPool(6);
executor.submit(runnable);
executor.shutdown(); // Thread doesn’t waits, it moves ahead, executor shuts down after all submitted runnable are done
executor.shutdownNow(); // Interrupts ongoing threads, returns queued tasks
executor.isShutdown(); 
executor.isTerminated(); // shutdown was requested and executor completed all tasks
executor.awaitTermination(10, TimeUnit.SECONDS); // waits till given time for executor termination
executor.invokeAll(collection of callable);
executor.invokeAny(collection of callable);

Future<T> tF = executor.submit(runnable/callable/(runnable, ret));
tF.isDone(); // If future is complete, even if failed
tF.get(); // Makes thread wait for future to be completed
tF.cancel(); 

Runnable has run(), returns void
Callable has call(), returns something

ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(6);
scheduler.schedule();
scheduler.scheduleAtFixedRate();
scheduler.scheduleWithFixedDelay(); // returns ScheduledFuture
scheduler.shutdown();

ExecutorService executor = Executors.newCachedThreadPool();

CountdownLatch
CountdownLatch latch = new CountdownLatch(numOfTasks);
Pass latch in each thread’s runnable and do latch.countdown() in finally
While in main method, do latch.await() // can pass time too

CyclicBarrier
All thread’s runnable await till all are completed, wait using barrier.await() in runnable

CompletableFuture.supplyAsync()
CompletableFuture.allOf()
cf.join()
cf.get()
cf.thenApply()
cf.thenCompose()

CompletableFuture = Future + CompletionStage + extra goodies

Volatile // threads won’t create a local copy of values
Atomic // makes variable thread safe

Atomic variables // like AtomicInteger
Concurrent data structures // like ConcurrentHashMap


Actor based concurrency:
Basic => https://www.youtube.com/watch?v=Fw-CXSG8KZE
Impact => https://www.youtube.com/watch?v=5RzhSN1u8DY
Squb => Paypal’s on top of Akka
https://www.youtube.com/watch?v=YTQeJegJnbo

Read code from libraries
