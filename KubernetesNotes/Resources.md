# K8 resources

- Contains a list of K8 resources and their breif intro/description
- Note: Refer to 04-built-in-resources-types directory for tasks, commands and yaml files

=================================================

# Namespace
- mechanism to group resources within a cluster
- 4 initial namespaces:
  - default
  - kube-system
  - kube-node-lease
  - kube-public
- deleting a namespace recursively deletes all resources inside it

> kubectl create namespace <namespace_name>

# Pod
- pods are created on worker nodes (DUH!), once created, check where it is created by following command
> k get pods -o wide
> kubectl get pods -w // to watch live

- smallest deployable unit
- can contain multiple containers
- contains Init container(s), runs in the beginning
- contains Sidecar container, runs alongside
- primare container(s)
- containers within a pod share networking and storage
- other available configurations:
  - listening ports
  - health probes
  - resource requests/limits
  - security context
  - environment variables
  - volumes
  - DNS policies

Defaults for pod yaml file -> https://github.com/BretFisher/podspec

# ReplicaSet (-> Pods)
- registers a config in etcd (Kube-apiserver does it), ReplicaSet Controller (running inside/managed by controller manager in control plane) watches it to create/delete pods based on latest config

- adds concept of replicas
- takes pod and replicates them
- config is wrapper on pod config

# Deployment (-> ReplicaSet -> Pods)
- deployments are configs to create replicaSets, which in turn is config to create pods
- creation process is similar to replicaSets
  - create config
  - Deployment Controller (running inside controller manager) watches config
  - cretes replica configs
  - ReplicaSet Controller takes over

- adds concept of rollouts and rollbacks on replicas
- used for long running stateless applications
- in listing both deployments and replicaset are visible because deployments creates replicaSets

> kubectl get deployments

# Service
- serves as an internal load balancer across replicas
- uses pod labels to determine which pods to serve
- types:
  - Cluster IP: internal to cluster
  - Nodeport: listens on each node on cluster
  - LoadBalancer: provisions external load balancer
- targetPort: The port the container (inside pod) is listening on (here, 80).
- port: The port exposed by the service internally (ClusterIP) to other pods.
- nodePort: The port on the Node machine itself exposed to the outside world (usually in range 30000–32767).
- handles load balancing, service discovery, and port forwarding within or outside the cluster.

> kubectl run curl-pod -it --rm --image=curlimages/curl --command -- sh // creates a temporary pod
> $ curl <service-name>:<port>

- service FQDN -> <service-name>.<namespace>.svc.cluster.local // .svc.cluster.local is default suffix

# Job (-> Pods)
- adds the concept of tracking "completions"
- used for execution of workloads that run to completion

> k get jobs

# CronJob (-> Job -> Pods)
- adds the concept of a schedule
- used for periodic execution of workloads that run to completion
- to test cron jobs, create a job out of cron job whcih can be manually triggered for testing

# DaemonSet (-> Pods)
- runs a copy of the specified pod on all (or a specified subset of) nodes in the cluster
- useful for applications such as:
  - cluster storage daemon
  - log aggregation
  - node monitoring

# StatefulSet (-> Pods)
- similar to deployment except
  - pods get sticky identity (pod-0, pod-1, etc)
  - each pod mounts separate volumes
  - rollout behaviour is ordered
- enables configuring workloads that require state management (e.g. primary vs read-replica for a db)

# ConfigMaps
- Enables environment specific configuration to be decoupled from container images
- 2 primary styles: Property like and file like

# Secrets
- Similar to ConfigMaps with one main difference, data is base64 encoded
- Because they are a separate resource type, they can be managed/controlled with specific authorization policies

# Ingress
- Enables routing traffic to many services via a single external LoadBalancer
- Many options to choose from! Ingress-nginx, HAProxy, Kong, Istio, Traefik
- Only officially supports layer 7 routing (e.g. http/https), but some implementations allow for layer 4 (TCP/UDP) with additional configuration

# Gateway API
- Evolution of the Ingress API
- Not to be confused with an “API Gateway”
- Adds support for TCP/UDP*
- Handles more advanced routing scenarios

# PV (Persistent Volume) & PVC (Persistent Volume Claim)
- Provides API for creating, managing, and consuming storage that lives beyond the life of an individual pod
- Access modes:
  - ReadWriteOnce (and new ReadWriteOncePod)
  - ReadOnlyMany
  - ReadWriteMany
- Reclaim Policy: Retain vs Delete

# RBAC (Role based access control) (Service Account, Role, RoleBinding)
- Provides applications (or users) access to the Kubernetes API
- Access can be granted by namespace OR cluster wide

# Labels and Annotations
Labels:
- Key-value pairs used to identify and organize Kubernetes resources
- Can be used to filter api-server queries (e.g. with kubectl)
Annotations:
- Key-value pairs used for non-identifying metadata
- Used for things like configuration details, deployment history
- Often used by tools to configure specific behaviors (e.g. ingress annotations)

# Others
- LimitRange
- NetworkPolicy
- MutatingWebhookConfiguration
- ValidatingWebhookConfiguration
- HorizontalPodAutoscaler
- CustomResourceDefinition

# Helm

Comb of:
- Package manager
- Templating engine

Primary use case
- Application deployment
- Environment management

Commands:
- helm install / helm upgrade
- helm rollback

- Features that matter
  - Metadata (Chart, release, values)
  - Variables
  - Conditionals (if)
  - Loops (range)