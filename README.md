# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](/udacity-c3-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. 
2. [The RestAPI Feed Backend](/udacity-c3-restapi-feed), a Node-Express feed microservice.
3. [The RestAPI User Backend](/udacity-c3-restapi-user), a Node-Express user microservice.

## Getting Setup

### Setup AWS resources 

#### S3 Bucket

Create a bucket for Media Bucket and set CORS configuration

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

#### PostgreSQL RDS Instance

Create a PostgreSQL RDS Instance

Create SubnetGroup consists of two subnets if needed

Create a Security Group for public access to port number `5432`

#### EKS Cluster and Nodegroup

Create EKS Cluster

```
eksctl create cluster \
 --name image-filter-cluster \
 --region us-west-2 \
 --without-nodegroup
```

Create EKS Nodegroup

```
eksctl create nodegroup \
--cluster image-filter-cluster \
--version auto \
--name my-workers \
--node-type t3.medium \
--nodes 2 \
--nodes-min 1 \
--nodes-max 4 \
--ssh-access \
--ssh-public-key jump-box \
--managed
```

Delete EKS Cluster and Nodegroup

```
eksctl delete nodegroup --cluster image-filter-cluster --name my-workers
eksctl delete cluster --name image-filter-cluster
```

### Travis Pipeline 

In order to setup Travis CI/CD Pipeline refer to [Travis CI: Refer this tutorial to get started with Travis CI](https://docs.travis-ci.com/user/tutorial/)

When a PR merge to `master` branch Travis Pipeline kicks in. The pipeline builds Docker images for feed, user, front, and reverseproxy and push to DockerHub.

- [ksleeq21/udacity-front](https://hub.docker.com/repository/docker/ksleeq21/udacity-frontend)
- [ksleeq21/udacity-restapi-feed](https://hub.docker.com/repository/docker/ksleeq21/udacity-restapi-feed)
- [ksleeq21/udacity-restapi-user](https://hub.docker.com/repository/docker/ksleeq21/udacity-restapi-user)
- [ksleeq21/reverseproxy](https://hub.docker.com/repository/docker/ksleeq21/reverseproxy)

#### Travis Pipeline - Set Environment Variables

```
AWS_ACCESS_KEY_ID
AWS_DEFAULT_REGION
AWS_MEDIA_BUCKET
AWS_PROFILE
AWS_SECRET_ACCESS_KEY
BASE64_ENCODED_AWS_CREDENTIALS
BASE64_ENCODED_POSTGRESS_PASSWORD
BASE64_ENCODED_POSTGRESS_USERNAME
DOCKER_PASSWORD
DOCKER_USERNAME
POSTGRESS_DB
POSTGRESS_HOST
USER_AUTH_JWT_SECRET
```

### Setup Kubenetes
Containerize the application, create the Kubernetes resource, and deploy it to Kubenetes cluster:

Create configMap and secret
```
kubectl apply -f env-configmap.yaml
kubectl apply -f env-secret.yaml
kubectl apply -f aws-secret.yaml
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

### Open application

http://localhost:8100