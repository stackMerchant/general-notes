# Beyond Concurrency


Concurrent HashMap (think how to handle this, table level locks)
CAS
ABA problem

Deadlock

Spinlock vs Mutex/synchronized
No sleep vs sleep

Reentrant lock (otherwise thread would block itself)
Try lock
Timed lock
Fair / unfair lock

Reentrant lock, semaphores, CountdownLatches all on
AbstractQueuedSynchronizer (AQS) which is on
CLH queue (linked-list), uses spin lock, but blocking kinda not full spin

CountdownLatches (one time use)
CyclicBarrier (reusable, it resets)

Lock-based
Lock free (CAS spin)
Wait free (no starvation)

These tell compiler/JVM to emit memory barriers:
volatile
atomic
synchronized
std::atomic

Volatile (provides visibility, required because of cached multi-core CPUs)
- Flush write to main memory (not literally to RAM, but does not gets stuck in registers, visible across via cache coherence)
- Invalidate other cores’ cached copies
- Prevent reordering around that variable
- When does a DCL fails? If variable in not volatile

Memory hierarchy:
Registers (inside CPU core)
L1 / L2
L3 Cache (shared among cores)
RAM
Disk

Atomic (provides visibility and atomicity)
- Spins
- No context switch
- Lower latency
- non-blocking
- uses CAS
- thread safe

Atomic’s comparison with Lock
- blocks thread
- context switch
- Higher latency

Mutex
- mutual exclusion
- like synchronised (but not re-entrant)

Context switching saves
- Stack
- Thread states
- CPU registers

Why context switching is a problem?
Context switching is expensive because it requires:
- saving/restoring CPU state
- flushing pipelines
- disrupting cache locality
- often costing thousands of cycles

32-bit systems limited to 4GB because of limited addresses
64-bit, practically unlimited

Virtual memory: A hardware + OS mechanism that maps per-process virtual addresses to physical RAM, enabling isolation, protection, and efficient memory use

Scheduling, done by OS, modern is time slicing for fairness, context switch happens here

What the Kernel Actually Does
1. Process Management
* Creates and destroys processes
* Performs context switching
* Schedules threads on CPU cores

1. Memory Management
* Implements virtual memory
* Maintains page tables
* Handles paging and swapping

1. Device Drivers
* Controls disk devices
* Manages network interfaces
* Handles USB devices
* Interfaces with GPUs

1. File Systems
* Implements open()
* Implements read()
* Implements write()
* Manages file metadata and storage

1. Inter-process Communication
* Pipes
* Sockets
* Futex mechanisms
* Shared memory

Futex
- Fast user space Mutex
- don’t go beyond kernel for locks if no contention
- only in linux, others have similar stuff too

Process
A process is a running instance of a program with its own isolated memory and resources
IPC via:
- pipes
- TCP Socket (most common)
- shared memory
- kernel managed message queues
- signals

Heap stack and stuff how is it in C++
- Objects can live on stack or heap
- No garbage collector

IO multiplexing

Think in terms of:
How does the thread wait?
How many threads do I need?
Who wakes me up?
Does kernel push or do I pull?

Read select, poll, epoll
https://www.youtube.com/watch?v=WuwUk7Mk80E

Epoll
- epoll is like a broker between your worker thread and kernel I/O events
- A kernel-managed event subscription and notification mechanism for file descriptors
- Uses epoll_create, epoll_wait, epoll_ctl (control)
- epoll has two main internal structures:
    - Interest list (RB-tree), all FDs you subscribed to
    - Ready list, only FDs currently ready
- Used by Nginx, Redis, Node.js

In a thread-per-connection or process-per-connection model, you typically do not need epoll
The kernel can directly wake the specific thread/process that is blocked on that connection
That’s how epoll is IO mix, more sockets, but limited workers
Had thundering herd problem, not anymore in modern

Edge vs Level Triggered

Level triggered
- Keeps notifying until fd is ready
- Drain socket buffer is optional, cause you’ll be notified again
- Default
- Easy
- Safer
- Forgiving

Edge triggered
- Notifies only when state changes
- Drain socket buffer is mandatory, cause you’ll not be notified again
- Faster and performant, low syscalls
- Hard to implement

Not preferred when:
- Few connections, context switch is saved
- CPU-Bound (heavy) Workloads
- When connections are always active, epoll is for many idle connections with small task
- Very Low Latency Micro-Optimization Scenarios
- Simpler code with blocking
- Low core system

io_uring:
- modern alternative to epoll
- io_uring lets you submit I/O requests to the kernel via a shared memory ring buffer and receive completion events asynchronously with minimal syscalls
- Submit I/O → kernel executes → you get completion notification (no readiness step)
- Kernel puts data where you want and then notifies you, Data is already in your buffer — no extra copy is done

What Happens During read()?
1. User calls read()
2. CPU switches to kernel mode
3. Kernel checks socket buffer
4. If empty, Block (or return EAGAIN)
5. If data, Copy to user buffer
6. Return to user mode
Includes:
- Mode switch
- Possible context switch
- Memory copy
That’s why syscalls are expensive

User vs kernel threads
