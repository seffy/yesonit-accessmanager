
# 📦 y!on8 (yes, on it!) Tool Access Manager

The **y!on8 Tool Access Manager** is another modular service within the **y!on8** platform.  
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
└─ app
   ├─ .dockerignore
   ├─ Dockerfile
   ├─ app.js
   ├─ controllers
   │  ├─ authController.js
   │  ├─ departmentController.js
   │  ├─ homeController.js
   │  ├─ landingController.js
   │  ├─ toolAccessController.js
   │  ├─ toolController.js
   │  └─ userController.js
   ├─ models
   │  ├─ Counter.js
   │  ├─ Department.js
   │  ├─ Tool.js
   │  ├─ ToolAccessRequest.js
   │  └─ User.js
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   │  ├─ css
   │  ├─ img
   │  └─ js
   │     ├─ scripts.js
   │     └─ theme.js
   ├─ routes
   │  ├─ authRoutes.js
   │  ├─ departmentRoutes.js
   │  ├─ homeRoutes.js
   │  ├─ requestRoutes.js
   │  ├─ testLoginRoutes.js
   │  ├─ toolAccessRoutes.js
   │  ├─ toolRoutes.js
   │  └─ userRoutes.js
   ├─ seed.js
   └─ views
      ├─ ViewAllUsers.ejs
      ├─ addTool.ejs
      ├─ addUser.ejs
      ├─ home.ejs
      ├─ login copy.htm
      ├─ login.ejs
      ├─ logintest.ejs
      ├─ partials
      │  ├─ footer.ejs
      │  └─ header.ejs
      ├─ requestTool.ejs
      ├─ updateRequest.ejs
      ├─ updateUser.ejs
      ├─ viewDepartments.ejs
      ├─ viewMyRequests.ejs
      ├─ viewRequests.ejs
      └─ yesonit.ejs

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
2. Navigate to the `app/` folder
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



## 🔁 Kubernetes Redeployment Steps

### ✅ 1. [Optional] Clean Up Previous Deployment

```bash
kubectl delete deployment yesonit-accessmanager-deployment
kubectl delete service yesonit-accessmanager-service
kubectl delete configmap yesonit-accessmanager-config
kubectl delete secret yesonit-accessmanager-secret
kubectl delete hpa yesonit-accessmanager-hpa
```

---

### 🐳 2. Rebuild and Push Docker Image

> Only if the code has changed or needs to be rebuilt

```bash
cd app
docker build -t josabana/yesonit-accessmanager:latest .
docker push josabana/yesonit-accessmanager:latest
```

---

### ⚙️ 3. Apply Kubernetes YAML Files

```bash
cd ../k8s
kubectl apply -f secret.yaml
kubectl apply -f configmap.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f hpa.yaml 
```

---

### 🔍 4. Verify Deployment Status

```bash
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get hpa
```

---

### 🌐 5. Access the App in Browser

If using `NodePort`, access via:
```bash
http://localhost:<your-node-port>   # Example: http://localhost:30008
```

To get the port:
```bash
kubectl get service yesonit-accessmanager-service
```

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
- Secrets must be Base64 encoded before adding to `secret.yaml`.
- `kubectl logs` can be used for basic application monitoring.

---


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

## 👨‍💻 Developer
- Designed and Developed by JosephSabana for SIT727 Cloud Computing Project


