
# 🔄 Rename or Update Project Name in Docker, Kubernetes, and GitHub

This guide explains how to safely rename your project (e.g., from `taskpilot` to `yesonit-accessmanager`) across all environments without losing history or configurations.

---

## 📁 1. Rename Local Project Folder

On your machine (terminal or file explorer):

```bash
mv taskpilot-accessmanager yesonit-accessmanager
cd yesonit-accessmanager
```

---

## 🐙 2. Rename GitHub Repository

1. Go to your repo on GitHub
2. Settings → Rename repository to `yesonit-accessmanager`
3. GitHub handles redirects automatically

Optional: update your local Git remote

```bash
git remote set-url origin https://github.com/your-username/yesonit-accessmanager.git
```

Check it worked:

```bash
git remote -v
```

---

## 🐳 3. Update Docker Image Name

Build and tag the image with your Docker Hub username and new project name:

```bash
docker build -t josabana/yesonit-accessmanager .
docker push josabana/yesonit-accessmanager
```

---

## ☸️ 4. Update Kubernetes YAML Files

### deployment.yaml
```yaml
metadata:
  name: yesonit-accessmanager-deployment
...
spec:
  containers:
  - name: yesonit-accessmanager
    image: josabana/yesonit-accessmanager
    ...
```

### service.yaml
```yaml
metadata:
  name: yesonit-accessmanager-service
spec:
  selector:
    app: yesonit-accessmanager
```

Then apply them:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

---

## 🧹 5. Clean Up Old Deployments

Once new resources are working, delete old ones:

```bash
kubectl delete deployment taskpilot-accessmanager-deployment
kubectl delete service taskpilot-accessmanager-service
```

---

## ✅ Summary

| Step | Task |
|------|------|
| 1 | Rename local folder |
| 2 | Rename GitHub repo |
| 3 | Tag/push new Docker image |
| 4 | Update Kubernetes YAMLs |
| 5 | Apply and test |
| 6 | Delete old resources |

---

You're now fully renamed to `yesonit-accessmanager` across GitHub, Docker Hub, and Kubernetes.
