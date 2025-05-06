
# TaskPilot Access Manager

TaskPilot Access Manager is a cloud-native web application designed for managing tool access requests within an organization.

Built using Node.js, Express, and MongoDB Atlas, the system supports user authentication, access level control, and CRUD operations for users, tools, and access requests.

The application has been containerized using Docker and orchestrated using Kubernetes, with complete implementation of Deployment, Service, ConfigMap, Secret, and Horizontal Pod Autoscaler (HPA).

Environment configurations are externalized using Kubernetes ConfigMaps and Secrets to align with best security practices.


---

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

## 📦 Project Structure

```
TASKPILOT-ACCESSMANAGER/
├── backend/
│   ├── app.js
│   ├── Dockerfile
│   ├── controllers/
│   ├── models/
│   ├── public/
│   ├── routes/
│   └── views/
├── k8s/
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   └── hpa.yaml
├── .env (for local testing only)
├── README.md
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
docker build -t taskpilot-accessmanager .
```

3. Run the Docker container:

```bash
docker run -p 3000:3000 taskpilot-accessmanager
```

4. Access the app at:
http://localhost:3000/login

---

## ☸️ How to Deploy with Kubernetes

1. Push your Docker image to DockerHub:

```bash
docker tag taskpilot-accessmanager josabana/taskpilot-accessmanager
docker push josabana/taskpilot-accessmanager
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
  name: taskpilot-secrets
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
  name: taskpilot-config
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
  name: taskpilot-accessmanager-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: taskpilot-accessmanager
  template:
    metadata:
      labels:
        app: taskpilot-accessmanager
    spec:
      containers:
      - name: taskpilot-accessmanager
        image: taskpilot-accessmanager:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: taskpilot-secrets
        - configMapRef:
            name: taskpilot-config
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
  name: taskpilot-accessmanager-service
spec:
  type: NodePort
  selector:
    app: taskpilot-accessmanager
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
  name: taskpilot-accessmanager-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: taskpilot-accessmanager-deployment
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



# TaskPilot Access Manager – Updating Workflow (After Local Code Changes)

## 📋 When you make local code changes

If you modify your app code (Node.js backend, EJS frontend, routes, controllers, etc), you must:

1. Rebuild your Docker image
2. Push it to Docker Hub
3. Delete the Kubernetes Pod to force pulling the new image

---

## 🛠 Step 1: Rebuild Docker Image

```bash
docker build -t taskpilot-accessmanager .
```

Or build directly tagged for Docker Hub:

```bash
docker build -t josabana/taskpilot-accessmanager .
```

---

## 🛠 Step 2: Tag the Docker Image (if needed)

If your image was built without Docker Hub name, tag it:

```bash
docker tag taskpilot-accessmanager josabana/taskpilot-accessmanager
```

✅ This tells Docker to point to your Docker Hub repo.

---

## 🛠 Step 3: Push to Docker Hub

```bash
docker push josabana/taskpilot-accessmanager
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
kubectl delete pod taskpilot-accessmanager-deployment-xxx-xxxxx
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
- name: taskpilot-accessmanager
  image: josabana/taskpilot-accessmanager
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

## 👨‍💻 Developer
- Designed and Developed by JosephSabana for SIT727 Cloud Computing Project
