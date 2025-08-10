# Basics

- Contains clarifying questions/answers on resources and other components

=================================================

# Basics

One worker node -> one physical machine
Like a powerful server in data center
It has its own OS (like a cloud VM running Ubuntu)
It runs Kubelet, container runtime (like containerd), and kube-proxy
It can run many pods

Pods -> Applications or Services
Each Pod has its own isolated IP, filesystem, and containers
Pod can run run many containers
The node's kubelet ensures these Pods run properly

+-------------------------------+
|         Worker Node           |
|-------------------------------|
|  kubelet + kube-proxy         |
|-------------------------------|
|  [ Pod A ]  [ Pod B ]         |
|     |          |              |
|   nginx      redis            |
|                               |
|  [ Pod C ]  [ Pod D ]         |
|  app+logger  app2+sidecar     |
+-------------------------------+

Each Pod is isolated:
Different IPs
Different namespaces
Can scale independently

All Pods on a node:
Share the node’s kernel
Run via the container runtime (e.g., containerd)
Can communicate via Pod IPs if network policies allow

Important Detail: Pod ≠ Process
A Pod is a logical concept, not a process or binary. It’s implemented by:
Running a "Pod Sandbox" (containerd sets up this isolation layer)
Running the actual containers inside that sandbox

# So What Happens When You Deploy a Pod?

API Server gets the Pod spec
Scheduler assigns the Pod to a Node
Kubelet on that Node receives the instruction
Kubelet talks to containerd using CRI and says: "Please run container my-image as per this Pod spec"
containerd:
Pulls the image if needed
Sets up namespaces, cgroups
Starts the container process
If the Pod has multiple containers: containerd runs all of them, sharing the same Pod sandbox.

CSI -> Standard plugin interface that allows Kubernetes to talk to storage systems (block/file/etc.) in a vendor-agnostic way

Real Example: Pod wants persistent volume, say your Pod uses a PersistentVolumeClaim (PVC)
Here's what happens:
Kubernetes detects a PVC and tries to bind it to a PersistentVolume (PV)
If no PV exists, and dynamic provisioning is configured, it calls the CSI Driver to create one
The CSI plugin talks to the actual storage backend (e.g., EBS, NFS, Ceph)
Once provisioned, kubelet uses the CSI Node Plugin (running on the node) to:
Mount the volume to the node
Expose it to the container via containerd
At this point, your Pod’s container sees the volume mounted at /data

# What is the kube-controller-manager?
- It is a binary (process) that runs inside the control plane node, and its job is to:
  Continuously monitor cluster state and apply changes to achieve desired state

- It includes many controllers, like:

| Controller Name           | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| Deployment Controller     | Ensures correct number of ReplicaSets         |
| ReplicaSet Controller     | Ensures correct number of Pods per ReplicaSet |
| Node Controller           | Watches node status                           |
| Job Controller            | Manages Job objects                           |
| EndpointSlice Controller  | Manages service endpoints                     |

CronJob Controller
DaemonSet Controller
StatefulSet Controller

# What Happens When You Create a ReplicaSet YAML
- You apply the YAML
  > kubectl apply -f replicaset.yaml
- Kube-apiserver stores the ReplicaSet object in etcd:
  - The entire config (desired number of replicas, pod template, labels, etc.) goes into etcd, the single source of truth
- ReplicaSet Controller (running inside the kube-controller-manager) is:
  - Watching etcd indirectly via the API server
  - It sees a new ReplicaSet object
- ReplicaSet Controller logic:
  - Compares the desired replica count (replicas: 3) with the actual pods running that match the label selector
  - If it finds fewer pods, it creates new pods using the podTemplateSpec
  - If there are too many, it deletes excess pods
- Ongoing Reconciliation
  - If a pod crashes or a node dies, the ReplicaSet controller will notice the difference and recreate the missing pod(s)
  - The updated state is again stored in etcd, closing the reconciliation loop
  - > kubectl get pods -w // to watch live

# What is a Kubernetes Service?

- Think of a Service as a stable, single entry point to access a dynamic set of pods behind it
- Even though pods have individual IPs that can change (especially if pods restart or get rescheduled), the Service remains stable and tracks all matching pods using labels

A Service is an abstraction that:
- provides a stable virtual IP (ClusterIP) or DNS name.
- routes traffic to a set of Pods, selected by labels.
- handles load balancing, service discovery, and port forwarding within or outside the cluster.
- services do not track the pods' IPs directly. They rely on label selectors.

High-Level Service Flow:
1. frontend Pod sends request to → my-backend-svc.default.svc.cluster.local
2. kube-dns/CoreDNS resolves DNS to ClusterIP (e.g., 10.96.0.42)
3. iptables/ipvs (via kube-proxy) intercepts traffic to 10.96.0.42
4. kube-proxy load balances and routes request to one backend pod's IP
5. backend pod receives traffic on containerPort (e.g., 8080)

How It Works Internally (Per Service Type):
1. ClusterIP (default)
  - a virtual load balanced internal service (with port)
  - Accessible only within the cluster.
  - kube-proxy programs iptables or IPVS rules so traffic to the ClusterIP gets forwarded to one of the matching pods.
2. NodePort
  - NodePort is like ClusterIP + one port opened on every node
  - upon creating a NodePort service, Kubernetes automatically creates an underlying ClusterIP service as part of it
  AND ALSO opens a port on each node for that service to be accessible externally for testing
  - Exposes the service on a port on every node’s IP (e.g., NODE_IP:30001)
  - Traffic to that port is routed to the appropriate pod via kube-proxy
3. LoadBalancer
  - Kubernetes creates a NodePort service behind the scenes
  - Then it asks the cloud provider (via cloud-controller-manager) to create a Load Balancer that forwards to that NodePort
  - Only available on cloud providers (e.g., AWS, GCP, Azure).
  - Automatically provisions an external Load Balancer.
  - External traffic → LoadBalancer → NodePort → Pod
4. ExternalName
  - No traffic routing, just a DNS alias to an external service (e.g., Google, Redis) so that internal components can access outside cluster resources


# Flow: What happens when you apply a Job?

1. You apply the YAML
  > kubectl apply -f job.yaml
2. Job object is registered in etcd
  - The Job spec (e.g. image, command, completions) is stored in etcd via the API server.
3. Job Controller (part of controller-manager) sees the Job
  - It detects there's a new Job to run.
  - It creates one or more Pods according to .spec.parallelism and .spec.completions.
4. Pods are scheduled to nodes
  - The scheduler assigns Pods to suitable nodes.
  - Container runtime (e.g. containerd) pulls the image and starts the containers.
5. Pod(s) run to completion
  - A Pod runs the specified command/script (e.g. python job.py).
  - If the container exits with exit code 0, it’s successful
  - Majority of apps exit with some code
  - Job controller watches Pod status.
6. Retries if failed
  - If a Pod fails (non-zero exit code), the Job controller creates a new Pod to retry it (depending on .backoffLimit).
7. Job completes
  - Once the desired number of Pods have succeeded (.spec.completions), the Job is marked complete.
  - It won’t create more Pods.
8. Pods are not deleted by default
  - They stay in Completed state unless ttlSecondsAfterFinished is set for cleanup.

# Flow of a CronJob
1. You apply a CronJob YAML
  > kubectl apply -f cronjob.yaml
2. CronJob is saved in etcd
  - Like all resources, the spec (e.g. schedule, template) is stored via the API server in etcd.
3. CronJob Controller watches the resource
  - A controller inside the kube-controller-manager constantly checks whether it’s time to create a new Job.
4. When time matches the schedule
  - A Job is created (as if you had applied a Job YAML).
  - That Job then runs the Pod(s) as described.
5. Job flow continues as usual
  - Pods run the task and exit.
  - If .successfulJobsHistoryLimit or .failedJobsHistoryLimit are set, old Jobs are cleaned up.

# What Happens When You Apply a DaemonSet?
1. The DaemonSet object is created and stored in etcd
  - When you kubectl apply -f daemonset.yaml, the API server validates and stores the configuration in etcd.
2. The DaemonSet Controller detects the new DaemonSet
  - A controller called the DaemonSet Controller (running as part of the controller manager) watches for new DaemonSets.
3. Controller creates Pods on all matching Nodes
  - It checks each node in the cluster:
  - If a Pod from the DaemonSet is not already running there
  - And if the node matches any node selectors / tolerations, etc. it schedules a new Pod on that node directly, bypassing the default scheduler.
4. The kubelet on each Node starts the Pod
  - Kubelet (running on the node) sees the Pod assigned to it and uses containerd (or Docker) to create the container.
5. Important: DaemonSet pods are not scheduled by the default kube-scheduler. The DaemonSet controller places them directly.

# Pod creation flows

Normal Pod Flow
- scheduler is responsible for scheduling
- for a Pod, ReplicaSet, Deployment, Job, CronJob
- When you create most pods via above mentioned resources the API server stores the Pod spec in etcd
- The kube-scheduler detects unscheduled Pods
- It decides which Node to place the Pod on (based on resources, taints/tolerations, etc.)
- It writes the Node name into the Pod spec
- Then the kubelet on that node runs the Pod

DaemonSet Pod Flow
- When you create a DaemonSet the DaemonSet Controller (part of Controller Manager) watches for Nodes and the DaemonSet spec
- For each eligible Node, it creates a Pod and directly assigns it to that Node
- This means the Pod's .spec.nodeName is already set
- Since the Node name is assigned, the kube-scheduler ignores it
- In this case DaemonSet Controller bypasses the default kube-scheduler and schedules Pods directly to Nodes

| Pod Type        | Scheduler Used?      | Who Assigns Node?       |
| --------------- | -------------------- | ----------------------- |
| Deployment Pod  | ✅ kube-scheduler     | kube-scheduler          |
| Job/CronJob Pod | ✅ kube-scheduler     | kube-scheduler          |
| DaemonSet Pod   | ❌ Bypasses scheduler | DaemonSet Controller    |
| Static Pod      | ❌ Not scheduled      | Kubelet (local to Node) |

# StatefulSet

1. What is the use case of StatefulSet?
- StatefulSet is used when your pods need to maintain identity, persistent storage, and stable network identity across reschedules
- Use cases: Databases (MySQL, PostgreSQL, MongoDB), Kafka, Zookeeper, RabbitMQ
- Any distributed or clustered system that needs unique identity and ordering

2. Why do we need a Headless Service?
- A Headless Service (clusterIP: None) is used to:
- Expose each pod in a StatefulSet individually via DNS
- Allow direct pod-to-pod communication using predictable DNS like:
  > <pod-name>.<service-name>.<namespace>.svc.cluster.local
- This allows each pod to be individually addressable, unlike normal services that load balance across all pods.
3. How is StatefulSet different from Deployment?
- Feature	Deployment	StatefulSet
- Identity	Pods are interchangeable	Pods have stable, unique identities
- Storage	Ephemeral	Persistent volume per pod
- Pod Names	Random	Deterministic (pod-0, pod-1, ...)
- Ordering	No start/stop order	Maintains startup & termination order
- Networking	No stable DNS per pod	Stable DNS using headless service

4. Can we create StatefulSet without Headless Service?
- Yes, but: Without a headless service, you lose stable DNS names for each pod.
- Then it's not really functioning as a true stateful system.
- Best practice: always pair StatefulSet with a headless service.

5. How does DNS work before and after Service is created?
- Without Service: Pod has an IP but no DNS name, and that IP is ephemeral.
- With Headless Service (StatefulSet):
- Each pod gets a stable DNS name. Example: mysql-0.mysql.default.svc.cluster.local
- With ClusterIP Service (Deployment): Only the service has a DNS, not individual pods.

6. Do pods have ephemeral IPs? Are they node-wide or cluster-wide?
- Pod IPs are ephemeral (may change on reschedule).
- They are cluster-wide — unique across the whole cluster, not just per node.

# StatefulSet Creation Flow (After kubectl apply -f statefulset.yaml)

1. You Apply the YAML
- This YAML usually includes:
- A Headless Service
- A StatefulSet with:
  - Pod template
  - Volume claim template

2. Kubernetes API Server Stores Spec in etcd
- The StatefulSet object is stored in etcd, Kubernetes' distributed key-value store.
- It becomes desired state (e.g., “3 replicas of this app”).

3. StatefulSet Controller Watches the Spec
- The StatefulSet controller, part of the controller manager, detects this new StatefulSet.
- It begins creating pods in order, starting from pod-0.

4. Headless Service Resolves Pod DNS
- The specified Headless Service ensures that each pod will get a DNS like:
  > pod-0.<service-name>.<namespace>.svc.cluster.local

5. Pod-0 is Created
- The controller:
- Creates a PersistentVolumeClaim (PVC) named data-<statefulset-name>-0.
- Binds it to a PersistentVolume (PV).
- Starts pod-0 and attaches the volume.

6. Sequential Pod Creation
- Only after pod-0 is Running and Ready, the controller creates pod-1.
- This continues until the desired number of replicas is reached.

7. Stable Identity and Storage
- Each pod gets:
- Stable hostname (pod-0, pod-1, etc.)
- Its own dedicated volume (e.g., for DB data)

8. Readiness Checks Control Progress
- If any pod fails to become Ready, subsequent pods are not started.
- Ensures ordered startup — critical for systems like Cassandra, Zookeeper, etc.

9. Updates Are Handled Safely
- On updates (e.g., new container image):
- StatefulSet updates one pod at a time, in reverse order.
- Ensures zero downtime for apps that depend on ordering.

10. Pod Identity Persists Through Restarts
- If a pod crashes or is evicted:
- It is re-scheduled with the same name and volume.
- Apps inside can resume work as state is preserved.

# What Are Init Containers?
- Init containers are special containers that run before the main containers in a pod start. They:
- Run in order, one after the other.
- Must all complete successfully for the main app container(s) to start.
- Can be used to prepare the environment (e.g., setup configs, wait for dependencies, initialize DB).
- They are useful in any pod, not just StatefulSets—but they are especially helpful in StatefulSets because of their ordered nature.

# 