
# 🚑 YesOnIt Kubernetes Deployment Fix Guide

## 📋 Problem Summary

You're seeing two different pod errors:

- `ImagePullBackOff`: Old deployment still pointing to a non-existent or non-pushed Docker image.
- `CreateContainerConfigError`: The new deployment is missing required Kubernetes Secrets.

---

## ✅ Step-by-Step Fix

### 🔁 1. Delete Old Deployment and Reapply Correct YAML

```bash
kubectl delete deployment yesonit-accessmanager-deployment
kubectl apply -f deployment.yaml  # Ensure image is josabana/yesonit-accessmanager:latest
```

### 🔒 2. Recreate Kubernetes Secret

If you're using environment variables like `MONGO_URI` and `SESSION_SECRET`, recreate the secret:

```bash
kubectl create secret generic yesonit-accessmanager-secret   --from-literal=MONGO_URI='your-mongo-uri'   --from-literal=SESSION_SECRET='your-secret-key'
```

> Replace `'your-mongo-uri'` and `'your-secret-key'` with actual values from your `.env` file.

### 🔄 3. Restart the Pod

Delete the pod showing `CreateContainerConfigError`:

```bash
kubectl delete pod <pod-name>
```

The pod will be automatically recreated with the updated secret.

---

## 🛠 Final Checks

- ✅ Image name in `deployment.yaml`: `josabana/yesonit-accessmanager:latest`
- ✅ Secret name: `yesonit-accessmanager-secret`
- ✅ Secret keys: `MONGO_URI`, `SESSION_SECRET`
- ✅ Pod status: `Running`

### 🔍 Check Status

```bash
kubectl get pods
kubectl logs <new-pod-name>
```

---

## 🎯 Outcome

Your Kubernetes deployment should now pull the correct image, use valid secrets, and run the app without errors.
