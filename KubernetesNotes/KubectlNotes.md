# Kubectl commands notess

=================================================

> kubectl <VERB> <NOUN> -n <NAMESPACE> -o <FORMAT>
=================================================

- alias k=kubectl
kubectx: helper CLI tool that makes it easy to switch between multiple Kubernetes clusters (contexts)
> kubectx // Lists all available contexts
> kubectx <context-name> // Switches to that context (or cluster like dev, prod, kind, gkc, aws)

> kubens <namespace_name> // switch namespace

> k get pods -n <POD_NAME>
> k get pods -A // --all-namespaces
> k get pods -l key=value // label selector
> kubectl get namespaces
> kubectl get deployments

Explain fields
> k explain <NOUN>.path.to.field // <NOUN>'s  path.to.field is from config yaml
> k explain pod.spec.containers.image

View logs
> k logs <POD_NAME>
> k logs deployment/<DEPLOYMENT_NAME>

Exec / Debug Containers
> k exec -it <POD_NAME> -c <CONTAINER_NAME> -- bash
> k debug -it <POD_NAME> --image=<DEBUG_IMAGE> -- bash

Port Forwarding
> k port-forward <POD_NAME> <LOCAL_PORT>:<POD_PORT>
> k port-forward svc/<DEPLOYMENT_NAME> <LOCAL_PORT>:<POD_PORT>
