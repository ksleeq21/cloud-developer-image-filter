# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](/udacity-c3-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. 
2. [The RestAPI Feed Backend](/udacity-c3-restapi-feed), a Node-Express feed microservice.
3. [The RestAPI User Backend](/udacity-c3-restapi-user), a Node-Express user microservice.

## Getting Setup

### Setup Docker Environment
You'll need to install docker https://docs.docker.com/install/. Open a new terminal within the project directory and run:

1. Build the images: `docker-compose -f docker-compose-build.yaml build --parallel`
2. Push the images: `docker-compose -f docker-compose-build.yaml push`
3. Run the container: `docker-compose up`

### Setup Travis CI/CD pipeline

[Travis CI: Refer this tutorial to get started with Travis CI](https://docs.travis-ci.com/user/tutorial/)


#### Set Environment Variables

1. Set DOCKER_USERNAME, DOCKER_PASSWORD to push docker images to Docker Hub

2. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION to execute `eksctl` commands

#### Create SSH key pair for loggin to EC2 instances

```
ssh-keygen -m PEM
```

### Setup AWS EKS Kubernetes Cluster

Create EKS Cluster

```
eksctl create cluster \
 --name image-filter-cluster \
 --region us-east-1 \
 --without-nodegroup
```

Create EKS Nodegroup

```
eksctl create nodegroup \
--cluster image-filter-cluster \
--version auto \
--name standard-workers \
--node-type t3.medium \
--nodes 3 \
--nodes-min 1 \
--nodes-max 4 \
--ssh-access \
--ssh-public-key /home/ubuntu/.ssh/id_rsa.pub \
--managed
```

Delete EKS Cluster and Nodegroup

```
eksctl delete nodegroup --cluster image-filter-cluster --name standard-workers
eksctl delete cluster --name image-filter-cluster
```

### Setup Kubenetes 
Containerize the application, create the Kubernetes resource, and deploy it to Kubenetes cluster:

Create configMap and secret
```
kubectl apply -f env-configmap.yaml
kubectl apply -f env-secret.yaml
kubectl apply -f aws-secret.yaml
kubectl get configmap 
kubectl get secret 
```

Create deployments
```
kubectl apply -f backend-feed-deployment.yaml
kubectl apply -f backend-user-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f reverseproxy-deployment.yaml
```

Create services
```
kubectl apply -f backend-feed-service.yaml
kubectl apply -f backend-user-service.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f reverseproxy-service.yaml
```

Set port forwarding
```
kubectl port-forward service/frontend 8100:8100
kubectl port-forward service/reverseproxy 8080:8080
```

Scale Up/Down
``` 
kubectl scale deploy backend-feed --replicas 5
kubectl scale deploy backend-user --replicas 3
```
