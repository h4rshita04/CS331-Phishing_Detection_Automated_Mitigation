
---

# I. Hosting Plan for Application Components

## 1. Host Environment

The PhishGuard system is deployed on a single Ubuntu-based Virtual Private Server (VPS) provisioned from a cloud infrastructure provider (e.g., DigitalOcean or equivalent).

All application components are containerized using Docker and orchestrated with Docker Compose. This ensures:

- Centralized deployment
- Simplified configuration management
- Reproducible environments
- Reduced operational complexity

---

## 2. Application Architecture

### Hosted Components

| Component              | Technology   | Hosting Method     | Purpose                                      |
|------------------------|-------------|-------------------|----------------------------------------------|
| Frontend               | React       | Docker Container  | User interface                               |
| Backend API            | FastAPI     | Docker Container  | REST API, OAuth handling, business logic     |
| Worker Service         | Python      | Docker Container  | Background email analysis processing         |
| Database               | PostgreSQL  | Docker Container  | Persistent storage and job queue             |
| Reverse Proxy          | Nginx       | Docker Container  | HTTPS termination and request routing        |

All containers communicate through an isolated internal Docker network.

---

