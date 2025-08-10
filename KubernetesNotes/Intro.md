# Intro

=================================================

Cluster -> Control plane (control plane nodes) + Data plane (worker nodes)

Components on control plane node:
1. Cloud controller manager (ccm) -> interface bw K8 and cloud providers
2. Controller manager (cm) -> makes sure actual state matches desired state
3. API -> interface to interact with K8
4. etcd -> highly available kv data store
5. scheduler -> assign pods to new nodes

Components on worker node:
1. kubelet -> spawn and manage workload, relay health check to CP's api
2. kube-proxy -> handles networking
3. workloads / containerD

K8 Standard Interfaces
1. Container Runtime Interface (containerD, crio-o)
2. Container Network Interface (Amazon VPC CNI, Azure CNI, GCP CNI, Calico, Flannel, Cilium)
3. Container Storage Interface (Cloud specific, Cer manager CSI Driver, Secrets Store CSI Driver)

CNCF Landscape -> https://landscape.cncf.io/
