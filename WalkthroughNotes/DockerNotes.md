Notes of Docker by Piyush

=================================================

Docker daemon
GUI (Docker desktop) and CLI

> docker -v

> docker images // list all images
> docker run -it <image_name> // -it for interactive, starts a container with image
> docker run -it ubuntu // fetches ubuntu image and starts a container

> docker container ls // list active containers
> docker container ls -a // list all containers
> docker start <container_name> // start container
> docker stop <container_name> // stop container
> docker exec <container_name> <command> // execute command in container_name, executes and disconnects
> docker exec -it <container_name> <command> // execute command in container_name, executes and remains connected
> 
> docker run -it -p <system_port>:<container_port> <image_name> // port mapping, can pass multiple
> docker run -it -e <key>:<value> <image_name> // pass environment variables, can pass multiple
 
// Create Dockerfile
// RUN, COPY, ENTRYPOINTS, WORKDIR are layers and are cached, any change at a layer results in rebuilding of itself and following layers
> docker build -t <tag> . // tag is image name
> 
> docker push <tag>
> docker login

// Create docker-compose.yml
> docker compose up
> docker compose down
> docker compose up -d // detached mode

// Networking
> docker run -it <container_name> <image_name> // start a container, with network bridge, which is default
> docker network inspect bridge // list all containers connected to bridge
> docker network ls // defaults are bridge, host and none
> docker run -it --network=host <image_name> // run container with host's network
> docker run -it --network=none <image_name> // run container with no network

// Custom networks
> docker network create -d bridge <network_name> // create custom network, -d is driver which is of type bridge
> docker run -it --network=<network_name> --name <container_name> <image_name> // start a container with image using custom network
> docker network inspect <network_name> // list all containers connected to custom network
// Containers on same network can talk to each other, can create a custom network and add containers to it

// Mounting volumes
> docker run -it -v <host_folder_path>:<container_folder_path> <image_name>
// Create custom volumes
> docker volume create <volumne_name> // mount using --mount source:destination
> docker volume ls
> docker volume inspect <volumne_name>

// Efficient caching in layers, in Dockerfile
// use COPY . . // copy everything from here to docker image, if not everything, add .dockerignore

// Multi stage builds
/*
    From ubuntu as builer // builder is name of stage and can be referenced by it later
    From node as runner
*/

// Logs
> docker logs <container_name>