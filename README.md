# NanoCMS Backend (TypeScript - Serverless)

This is the **backend service** for **NanoCMS**, a lightweight and extensible Content Management System (CMS).  
The backend is built with **TypeScript** and designed for **AWS Serverless** architecture, ensuring modularity, scalability, and cost-efficiency.

Serverless Approach: Each module (Posts, Categories, Tags, Auth) is implemented as a separate Lambda function.

Database: Aurora Serverless (Postgres) + Prisma/TypeORM for modular DB access.

CDN: CloudFront + S3 for global static asset delivery.

API Gateway: Routes HTTP requests to the appropriate Lambda module

---

## 🚀 Features (current & planned)

✅ Post, Category, and Tag management (CRUD APIs)

✅ Page creation for simple static content

🔐 Authentication & Authorization (JWT or AWS Cognito)

🗄️ Database: PostgreSQL (with Prisma/TypeORM)

🌐 REST API (GraphQL planned for future versions)

📦 Modular design with separate Lambdas for each feature

⚡ Event-driven enhancements for caching and notifications (planned)

---

## 📐 Architecture

```mermaid
flowchart LR
    User(["User"])
    CDN["Amazon CloudFront\n(Global CDN)"]
    S3["Amazon S3 + CloudFront\n(React Frontend)"]
    APIGW["Amazon API Gateway"]
    LambdaPosts["AWS Lambda - Posts Module"]
    LambdaCategories["AWS Lambda - Categories Module"]
    LambdaTags["AWS Lambda - Tags Module"]
    LambdaAuth["AWS Lambda - Auth Module"]
    Aurora[("Amazon Aurora Serverless\n(Postgres)")]

    User -->|HTTPS Request| CDN
    CDN -->|Static Assets| S3
    CDN -->|API Calls| APIGW
    APIGW -->|Invoke Function| LambdaPosts
    APIGW -->|Invoke Function| LambdaCategories
    APIGW -->|Invoke Function| LambdaTags
    APIGW -->|Invoke Function| LambdaAuth
    LambdaPosts -->|SQL Queries| Aurora
    LambdaCategories -->|SQL Queries| Aurora
    LambdaTags -->|SQL Queries| Aurora
    LambdaAuth -->|SQL Queries| Aurora
```

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NimaMisaghi/NanoCMS-backend-ts.git
cd NanoCMS-backend-ts
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/nanocms"
JWT_SECRET="your-secret-key"
AWS_REGION="your-aws-region"
```

### 4. Run locally (Serverless Offline)

```bash
npm run dev
```

### 5. Deploy to AWS

```bash
npm run deploy
```

(Assuming you're using Serverless Framework, CDK, or SAM)

## 📌 Roadmap

- [ ] Core CMS features (Posts, Categories, Tags)
- [ ] Authentication & user roles
- [ ] GraphQL API support
- [ ] Plugin system for extensions
- [ ] Admin dashboard (with React frontend)
- [ ] Deployment automation with Terraform/CDK
- [ ] Event-driven caching and notifications

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m "Add awesome feature"`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request 🚀
