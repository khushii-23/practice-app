# AWS Practice App

A tiny Node/Express backend + static HTML frontend with dummy data, built for practicing AWS deployment.

```
aws-practice-app/
├── backend/          Express API (port 5000)
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/         Static page (HTML + JS)
│   ├── index.html
│   ├── config.js     <- set API_BASE here
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── .gitignore
```

## API

| Method | Path         | Description              |
|--------|--------------|--------------------------|
| GET    | /health      | Health check             |
| GET    | /api/items   | List dummy items         |
| POST   | /api/items   | Add item `{ "name": "" }`|

Data is stored in memory, so it resets whenever the backend restarts.

## Run locally

Without Docker:

```bash
cd backend && npm install && npm start      # http://localhost:5000
# in another terminal
cd frontend && npx serve .                   # or just open index.html
```
(When running this way, set `window.API_BASE = "http://localhost:5000"` in `frontend/config.js`.)

With Docker:

```bash
docker compose up --build                    # http://localhost
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/aws-practice-app.git
git push -u origin main
```

## AWS deployment ideas (pick one to practice)

### Option A: Everything on one EC2 instance (simplest)
1. Launch an EC2 instance (Amazon Linux 2023, t2/t3.micro).
2. Security group: allow inbound 22 (SSH) and 80 (HTTP).
3. SSH in and install Docker + Git:
   ```bash
   sudo dnf install -y docker git
   sudo systemctl enable --now docker
   sudo usermod -aG docker ec2-user   # log out and back in
   sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
     -o /usr/local/lib/docker/cli-plugins/docker-compose --create-dirs
   sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
   ```
4. `git clone` your repo, then `docker compose up -d --build`.
5. Open `http://<EC2-PUBLIC-IP>`.

### Option B: Split frontend and backend
- **Backend**: EC2 (allow inbound 5000) or Elastic Beanstalk / ECS Fargate (push the image to ECR first).
- **Frontend**: upload `frontend/index.html` and `frontend/config.js` to an S3 bucket with static website hosting, optionally behind CloudFront.
- Edit `frontend/config.js` so `API_BASE` points to the backend URL (EC2 IP:5000, or an ALB DNS name).
- Backend already has CORS enabled, so cross-origin calls work.

### Things worth trying afterwards
- Put an Application Load Balancer in front of the backend and use `/health` for the target group health check.
- Add a custom domain with Route 53 and HTTPS with ACM.
- Set up GitHub Actions to build and deploy on every push.
- Swap the in-memory array for RDS or DynamoDB.

Remember to stop or terminate resources when done to avoid charges.
