## DevOps Directive Walkthrough Steps

=================================================

# Basic env setup

Install Docker
Install devbox
Clone the repo and get into it

> devbox shell
> devbox list

> cd 03
> task --list-all

Add alias -> tl = task --list-all

=================================================

# Setup kind config

Run task 1 -> creates a git-ignored Kind config file
> kind:01-generate-config

In config file
containerPath -> path where the folder will appear inside the node container
hostPath -> folder from your local machine (Mac in this case)

=================================================

# Create a k8 cluster with kind

Run task 2 -> creates clusters
> task kind:02-create-cluster // This does a bunch of stuff

STEP
Sets up docker network (network name is kind in my case)
> docker network create kind
> docker network ls // To check
> docker inspect kind // To check

STEP
Pulls kindest node image
That image is a pre-baked Linux image with: kubeadm, kubelet, kube-proxy, Docker runtime, Other K8s dependencies
It's like a Kubernetes-ready mini OS.

STEP
Creates 1. A control plane container and 2. Worker node(s) from that one image on above created (kind) network
> docker run --name kind-control-plane --network kind ...
> docker run --name kind-worker --network kind ...
> docker container ls // To check

STEP
Kind uses kubeadm inside each container
On control plane container, kind runs
> kubeadm init --config /kind/kubeadm.conf // This initializes the Kubernetes control plane

If there are more than one control plane, subsequent planes are added through
> kubeadm join <control-plane-endpoint>:6443 \
  --token <token> \
  --discovery-token-ca-cert-hash sha256:... \
  --control-plane

In each worker container, it runs
> kubeadm join <control-plane-ip>:6443 --token ... --discovery-token-ca-cert-hash ... // This adds the node to the cluster

These steps can be seen in logs
> docker logs kind-control-plane // docker logs <worker container name>

STEP
Configure kubectl by setup kube config in "~/.kube/config"

STEP
You have a k8 cluster ready

STEP (Drawing parallel)
In production, you need to provision real machines
create a private network (like a VPC)
install Kubernetes components on all machines
and run kubeadm to glue everything together
Configure kubectl by setup kube config
Configure networking interface (so that each pod on a worker node has its own IP)
Now a working cluster

=================================================

# Basic status checks

> kubectl get nodes
> kubectl get pods -A
> kubectl explain <resource>
> kubectl get namespaces

> k get pods -A -o wide // -o wide will give more info, such as what node it is deployed on

=================================================

# Cover resources
In resource notes

# Helm
- Package manager

# Build demo application on local

# Build container images

# Deploy demo application

# Extending K8 API
- Custom Resource Definitions (CRDs) and Custom Controllers
- Use cases/ projects:
  - Embed custom logic into “Operators” (CloudNativePG)
  - Manage TLS certificates (Cert-Manager)
  - Deploy infrastructure with automatic reconciliation (Crossplane)
- Tooling to build CRD and custom controllers
  - kubebuilder (The tutorial literally builds a replacement for the CronJob Controller!)
  - Operator SDK
  - Metacontroller
  - Build your own with any k8s client
- see CRDs on cluster
  - > k get crd

# Deploying auxiliary tooling

