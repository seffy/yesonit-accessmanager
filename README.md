# y!on8 Platform Overview

`y!on8` (formerly known as TaskPilot, and pronounced “yes, on it”) is a unified, modular, cloud-native platform designed to simplify and automate internal workflows across organizations. It enables teams to manage resource access, content requests, approvals, and operational tasks through scalable, role-based tools—all within a secure and centralized environment.

Each application within y!on8 is built and deployed as an independent microservice, allowing for enhanced scalability, maintainability, and flexibility. The platform integrates seamlessly using a shared frontend UI (EJS), connects to cloud-hosted MongoDB databases, and is deployed using Docker and Kubernetes—making it ideal for small to medium enterprises (SMEs) as well as growing teams.

Whether it’s submitting a content development request, requesting access to enterprise tools, or managing IT asset handovers, y!on8 provides a tailored suite of apps that align with real-world business processes and internal control standards.

---

## 🧩 Microservices Within y!on8

Each microservice has:
- Its own Node.js + Express backend
- A dedicated MongoDB Atlas database
- Independent deployment with Docker and Kubernetes
- Secrets and configuration managed via Kubernetes Secrets & ConfigMaps

| Microservice | Description |
|--------------|-------------|
| **Access Manager** | Allows users to request internal tool access, with approval workflow and admin controls. |
| **Training Request Manager** | Handles employee training/course requests and supervisor approval tracking. |
| **Content Request Development Manager** | Enables departments to request learning, media, or marketing content. |
| **Asset & Equipment Manager** | Manages IT asset checkout requests like laptops, monitors, etc. |
| **Software License Manager** | Tracks and handles requests for software licenses and renewals. |

---


# 📦 y!onit Tool Access Manager

The **y!onit Tool Access Manager** is another modular service within the **y!on8** platform.  
It enables employees to request access to internal tools, platforms, and software licenses in a structured, trackable way.

This module simplifies the tool access workflow by allowing users to:
- Submit tool access requests for themselves or on behalf of others
- Choose from a predefined list of internal tools and systems
- Provide justifications and approval contacts
- Track request status through stages such as *Pending*, *Approved*, and *Provisioned*

The application is built as an independent microservice, sharing the y!on8 UI and MongoDB backend, and is deployed using Docker and Kubernetes. Role-based access ensures that only authorized users can view or approve access requests, supporting both security and operational efficiency.

## 🎯 Ideal Use Case

This tool is ideal for:
- Onboarding new employees who need access to tools like Jira, Slack, Adobe, internal CRMs, etc.
- Managing role-based or department-based tool entitlements
- Creating a centralized record of who has access to what tools and why

## 📋 Features
- User Authentication (Login/Logout)
- Access Control based on user level
- Submit Tool Access Requests
- Add Users and Add Tools (Level 3+ only)
- Dockerized Application
- Full Kubernetes Deployment with:
  - Deployment
  - Service
  - ConfigMap
  - Secret
  - Horizontal Pod Autoscaler (HPA)

---

## 📦 Project Structure - y!onit Tool Access Manager

```
yesonit-accessmanager
├─ README.md
├─ backend
│  ├─ .dockerignore
│  ├─ Dockerfile
│  ├─ app.js
│  ├─ controllers
│  │  ├─ authController.js
│  │  ├─ homeController.js
│  │  ├─ toolAccessController.js
│  │  ├─ toolController.js
│  │  └─ userController.js
│  ├─ models
│  │  ├─ Counter.js
│  │  ├─ Tool.js
│  │  ├─ ToolAccessRequest.js
│  │  └─ User.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ css
│  │  │  ├─ o-style.css
│  │  │  ├─ styles.css
│  │  │  ├─ views.css
│  │  │  └─ workflow.css
│  │  ├─ img
│  │  └─ js
│  │     └─ theme.js
│  ├─ routes
│  │  ├─ authRoutes.js
│  │  ├─ homeRoutes.js
│  │  ├─ toolAccessRoutes.js
│  │  ├─ toolRoutes.js
│  │  └─ userRoutes.js
│  ├─ seed.js
│  └─ views
│     ├─ addTool.ejs
│     ├─ addUser.ejs
│     ├─ home.ejs
│     ├─ login.ejs
│     ├─ requestTool.ejs
│     └─ viewRequests.ejs
├─ k8s
│  ├─ configmap.yaml
│  ├─ deployment.yaml
│  ├─ hpa.yaml
│  ├─ secret.yaml
│  └─ service.yaml

```

---

## 🛠 Prerequisites

- Node.js v18+
- npm
- Docker
- Kubernetes (Docker Desktop, or Cloud Kubernetes)
- MongoDB Atlas (cloud database)

---

## 🚀 How to Run Locally

1. Clone the repository
2. Navigate to the `backend/` folder
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in project root:

```bash
PORT=3000
MONGO_URI=your-mongodb-connection-string
SESSION_SECRET=your-session-secret
```

5. Start the app:

```bash
npm start
```

6. Access the app at:  
http://localhost:3000/login

---

## 🐳 How to Build and Run with Docker

1. Navigate to `backend/` folder
2. Build the Docker image:

```bash
docker build -t yesonit-accessmanager .
```

3. Run the Docker container:

```bash
docker run -p 3000:3000 yesonit-accessmanager
```

4. Access the app at:
http://localhost:3000/login

---

## ☸️ How to Deploy with Kubernetes

1. Push your Docker image to DockerHub:

```bash
docker tag yesonit-accessmanager josabana/yesonit-accessmanager
docker push josabana/yesonit-accessmanager
```

## Deployment Steps

### 1. Create Secret

Encode credentials:

```bash
echo -n "your_mongo_uri" | base64
echo -n "your_session_secret" | base64
```

Create `k8s/secret.yaml`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: yesonit-secrets
type: Opaque
data:
  MONGO_URI: <base64_mongo_uri>
  SESSION_SECRET: <base64_session_secret>
```

Apply:

```bash
kubectl apply -f k8s/secret.yaml
```

---

### 2. Create ConfigMap (Optional)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: yesonit-config
data:
  PORT: "3000"
```

Apply:

```bash
kubectl apply -f k8s/configmap.yaml
```

---

### 3. Deploy Application

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yesonit-accessmanager-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: yesonit-accessmanager
  template:
    metadata:
      labels:
        app: yesonit-accessmanager
    spec:
      containers:
      - name: yesonit-accessmanager
        image: yesonit-accessmanager:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: yesonit-secrets
        - configMapRef:
            name: yesonit-config
        imagePullPolicy: IfNotPresent
```

Apply:

```bash
kubectl apply -f k8s/deployment.yaml
```

---

### 4. Expose Service

Create `k8s/service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: yesonit-accessmanager-service
spec:
  type: NodePort
  selector:
    app: yesonit-accessmanager
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
      nodePort: 30008
```

Apply:

```bash
kubectl apply -f k8s/service.yaml
```

Access at: [http://localhost:30008](http://localhost:30008)

---

### 5. Set up HPA (Auto-Scaling)

Create `k8s/hpa.yaml`:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: yesonit-accessmanager-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: yesonit-accessmanager-deployment
  minReplicas: 1
  maxReplicas: 3
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
```

Apply:

```bash
kubectl apply -f k8s/hpa.yaml
```

---

## Kubernetes Verification Commands

```bash
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get hpa
kubectl logs <pod-name>
```

✅ Ensure all pods are Running.  
✅ NodePort exposed at 30008.  
✅ HPA status active.

---



# yesonit Access Manager – Updating Workflow (After Local Code Changes)

## 📋 When you make local code changes

If you modify your app code (Node.js backend, EJS frontend, routes, controllers, etc), you must:

1. Rebuild your Docker image
2. Push it to Docker Hub
3. Delete the Kubernetes Pod to force pulling the new image

---

## 🛠 Step 1: Rebuild Docker Image

```bash
docker build -t yesonit-accessmanager .
```

Or build directly tagged for Docker Hub:

```bash
docker build -t josabana/yesonit-accessmanager .
```

---

## 🛠 Step 2: Tag the Docker Image (if needed)

If your image was built without Docker Hub name, tag it:

```bash
docker tag yesonit-accessmanager josabana/yesonit-accessmanager
```

✅ This tells Docker to point to your Docker Hub repo.

---

## 🛠 Step 3: Push to Docker Hub

```bash
docker push josabana/yesonit-accessmanager
```

✅ Your latest code is now available on Docker Hub.

---

## 🛠 Step 4: Delete Old Kubernetes Pod

Find your current pods:

```bash
kubectl get pods
```

Then delete your running pod:

```bash
kubectl delete pod <your-pod-name>
```

Example:

```bash
kubectl delete pod yesonit-accessmanager-deployment-xxx-xxxxx
```

✅ Kubernetes Deployment will automatically create a new pod using your updated image.

---

## 📋 Optional: Force Kubernetes to Always Pull New Image

In your `deployment.yaml`, under `containers`, add this:

```yaml
imagePullPolicy: Always
```

Example:

```yaml
containers:
- name: yesonit-accessmanager
  image: josabana/yesonit-accessmanager
  ports:
  - containerPort: 3000
  imagePullPolicy: Always
```

✅ This ensures Kubernetes always pulls the latest image without needing manual pod deletion.

---


# 📋 Kubernetes Artifacts Explanation

| File | Purpose |
|:-----|:--------|
| `deployment.yaml` | Deploys the application pods |
| `service.yaml` | Exposes the application to outside users |
| `configmap.yaml` | Stores non-sensitive environment variables |
| `secret.yaml` | Stores sensitive data like MongoDB URI securely |
| `hpa.yaml` | Enables Horizontal Pod Autoscaling based on CPU usage |

---

# 📣 Important Notes

- MongoDB used is hosted in MongoDB Atlas (external DB).
- Persistent Volume Claims (PVCs) not needed because no local database state to persist.
- Secrets must be Base64 encoded before adding to `secret.yaml`.
- `kubectl logs` can be used for basic application monitoring.

---

# 📚 References
- Kubernetes Documentation
- Docker Documentation
- MongoDB Atlas Documentation

---

# yesonit Access Manager – Kubernetes Restart Recovery Guide

## 📋 Problem Encountered
When restarting Docker Desktop (and Kubernetes), some resources like Kubernetes Secrets and environment settings are lost.

Result: Visiting http://localhost:30008 may cause login errors (e.g., "Server Error. Please try again.")

---

## 📋 Common Causes
- Kubernetes Secrets (MONGO_URI, SESSION_SECRET) not persisted.
- Pods restarted without correct environment variables.
- Application inside pod cannot connect to MongoDB Atlas.

---

## 📋 Quick Recovery Steps

### 🛠 1. Check if Pod is Running
```bash
kubectl get pods
```

### 🛠 2. Check Pod Logs
```bash
kubectl logs <pod-name>
```

Look for errors like missing MONGO_URI or database connection issues.

### 🛠 3. Reapply Secrets
```bash
kubectl apply -f k8s/secret.yaml
```

This reloads MongoDB URI and session key securely.

### 🛠 4. Delete Pod
```bash
kubectl delete pod <pod-name>
```

The Deployment will recreate a new pod automatically using the updated Secrets.

### 🛠 5. Verify and Access App
```bash
http://localhost:30008
```

Login should now work without server errors.

---

## 📋 Why This Happens
- Docker Desktop’s Kubernetes does NOT persist Secrets/ConfigMaps across restarts (unlike production clusters).
- Manual re-application of secrets after reboot is a normal process during development.

---

# 🎯 Summary
After restarting Docker Desktop, always:
1. Reapply `k8s/secret.yaml`.
2. Delete pods if necessary to trigger fresh deployment.



## 👨‍💻 Developer
- Designed and Developed by JosephSabana for SIT727 Cloud Computing Project