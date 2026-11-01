# WorkBoard – Kubernetes Deployment

A Kubernetes-based deployment of the WorkBoard application using Deployments, Services, StatefulSet, Persistent Volumes, ConfigMaps, Secrets, Horizontal Pod Autoscaler (HPA), and RBAC.

## Project Overview

WorkBoard is a web application deployed on a Kubernetes cluster. The application consists of a frontend, backend, and MySQL database.

### Architecture

```text
                 User
                  |
                  v
           Frontend Service
             (NodePort)
                  |
                  v
           Frontend Pods
             (Nginx)
                  |
                  v
           Backend Service
             (ClusterIP)
                  |
                  v
           Backend Pods
           (Node.js API)
                  |
                  v
           MySQL Service
           (Headless)
                  |
                  v
          MySQL StatefulSet
                  |
                  v
          Persistent Storage
```

## Technologies Used

- Kubernetes
- Docker
- Docker Hub
- MySQL 8.4
- Nginx
- YAML
- ConfigMaps
- Kubernetes Secrets
- StatefulSet
- Persistent Volumes (PV)
- Persistent Volume Claims (PVC)
- Horizontal Pod Autoscaler (HPA)
- RBAC

## Kubernetes Resources

| File | Description |
|---|---|
| `namespace.yml` | Creates WorkBoard namespace |
| `configMap.yml` | Application environment configuration |
| `secret.yml` | Stores sensitive configuration |
| `frontend-deployment.yml` | Frontend deployment |
| `frontend-service.yml` | Frontend NodePort service |
| `frontend-hpa.yml` | Frontend autoscaling |
| `backend-deployment.yml` | Backend deployment |
| `backend-service.yml` | Backend service |
| `mysql-service.yml` | MySQL headless service |
| `mysql-stateful.yml` | MySQL StatefulSet |
| `admin-role.yml` | Admin RBAC role |
| `intern-role.yml` | Intern RBAC role |
| `intern-role-binding.yml` | Intern role binding |

## Prerequisites

Make sure the following tools are installed:

- Docker
- Kubernetes cluster (Kind, Minikube, or another cluster)
- kubectl
- Git

## Deployment Guide

### 1. Clone the Repository

```bash
git clone https://github.com/fahadkh14/workboard.git
cd workboard/k8s
```

### 2. Create Namespace

```bash
kubectl apply -f namespace.yml
```

### 3. Apply Configuration

```bash
kubectl apply -f configMap.yml
kubectl apply -f secret.yml
```

Make sure the ConfigMap and Secret contain the required database configuration.

### 4. Deploy MySQL

```bash
kubectl apply -f mysql-service.yml
kubectl apply -f mysql-stateful.yml
```

Check MySQL resources:

```bash
kubectl get statefulsets,pods,pvc -n workboard
```

### 5. Deploy Backend

```bash
kubectl apply -f backend-deployment.yml
kubectl apply -f backend-service.yml
```

### 6. Deploy Frontend

```bash
kubectl apply -f frontend-deployment.yml
kubectl apply -f frontend-service.yml
```

### 7. Configure Autoscaling

```bash
kubectl apply -f frontend-hpa.yml
```

### 8. Configure RBAC

```bash
kubectl apply -f admin-role.yml
kubectl apply -f intern-role.yml
kubectl apply -f intern-role-binding.yml
```

## Verify Deployment

Check all resources:

```bash
kubectl get all -n workboard
```

Check Pods:

```bash
kubectl get pods -n workboard
```

Check Services:

```bash
kubectl get svc -n workboard
```

Check Persistent Volumes:

```bash
kubectl get pv,pvc -n workboard
```

Check HPA:

```bash
kubectl get hpa -n workboard
```

Check deployment status:

```bash
kubectl rollout status deployment/frontend -n workboard
kubectl rollout status deployment/backend-deployment -n workboard
```

## Access Application

The frontend is exposed using a NodePort Service.

```bash
kubectl get svc frontend -n workboard
```

If NodePort is configured as `30080`, access it using:

```text
http://<NODE-IP>:30080
```

For a Kind cluster, ensure that the NodePort is reachable from the host machine. Port mapping or another networking configuration may be required.

## Useful Kubernetes Commands

```bash
# View Pods
kubectl get pods -n workboard

# View Deployments
kubectl get deployments -n workboard

# View Services
kubectl get svc -n workboard

# View StatefulSets
kubectl get statefulsets -n workboard

# View HPA
kubectl get hpa -n workboard

# View Pod logs
kubectl logs <POD-NAME> -n workboard

# Describe a Pod
kubectl describe pod <POD-NAME> -n workboard

# View events
kubectl get events -n workboard --sort-by=.lastTimestamp
```

## Security Notes

- Do not commit real passwords, database credentials, or JWT secrets to a public GitHub repository.
- Kubernetes Secret values encoded in Base64 are not encrypted by default.
- Use appropriate RBAC permissions.
- Use secure secret-management practices for production deployments.

## Future Improvements

- Implement CI/CD using GitHub Actions.
- Integrate Argo CD for GitOps.
- Add Prometheus and Grafana monitoring.
- Configure centralized logging.
- Add Ingress and HTTPS.
- Improve application security and resource management.

## Author

**Mohd Fahad Khan**

GitHub: [fahadkh14](https://github.com/fahadkh14)

LinkedIn: [Mohd Fahad Khan](https://linkedin.com/in/mohd-fahad-khan-06b39533b)

---

**Project:** WorkBoard – Kubernetes Deployment  
**Purpose:** Hands-on DevOps and Kubernetes learning project.

