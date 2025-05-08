
# TaskPilot Access Manager – Kubernetes Restart Recovery Guide

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
