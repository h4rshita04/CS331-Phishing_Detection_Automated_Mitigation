
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
## 2. Deployment Strategy

### Step 1: Server Configuration

- Provision an Ubuntu-based VPS.
- Configure firewall (UFW):

  - Allow SSH (Port 22, restricted access)
  - Allow HTTP (Port 80)
  - Allow HTTPS (Port 443)

- Disable root login.
- Enable SSH key-based authentication.
- Install Docker and Docker Compose.

---

### Step 2: Container Deployment

A `docker-compose.yml` configuration file will be used to define and deploy:

- Nginx container (reverse proxy)
- Frontend container
- Backend container
- Worker container
- PostgreSQL container

Environment variables will be configured for:

- Google OAuth Client ID
- Google OAuth Client Secret
- JWT secret key
- Database credentials

All services will operate within an isolated Docker network.

---

### Step 3: API and OAuth Configuration

- Register the domain in Google Cloud Console.
- Enable Gmail API.
- Configure OAuth 2.0 credentials.
- Add the following redirect URI:
(https://domain.com/auth/google/callback)
- Ensure backend base URL matches the registered OAuth domain.

---

### Step 4: Reverse Proxy and HTTPS Configuration

- Nginx will route:

  - Root requests (`/`) to the frontend container.
  - API requests (`/api/*`) to the backend container.

- Let’s Encrypt SSL certificates will be installed.
- HTTP traffic will be redirected to HTTPS.

---

### Step 5: Inter-Component Communication

- Backend communicates with PostgreSQL using internal Docker networking.
- Worker service polls PostgreSQL for queued analysis jobs.
- Worker launches temporary analysis containers for phishing detection.
- Results are written back to PostgreSQL.

All sensitive services (database and worker) are not exposed publicly.

---
## 3. Security Measures

### Infrastructure Security

* Firewall enabled with restricted ports.
* SSH key-based authentication.
* HTTPS enforced using SSL certificates.

### Application Security

* Token-based authentication (JWT).
* Role-based access control (User and Admin roles).
* OAuth 2.0 integration (no password storage).

### Container Security

* Analysis containers configured with:

  * No outbound network access (where applicable).
  * CPU and memory limits.
  * Read-only mounts for input data.
* Secrets stored as environment variables, not hardcoded.

### Data Security

* OAuth tokens encrypted before storage.
* No plaintext credentials stored in the database.
* Database accessible only within internal Docker network.
  
---
# II. End User Access and System Interaction

---

## 1. User Access to Services

End users access the system through a web browser using a secure HTTPS connection:
(https://domainname.com).
The browser communicates with the Nginx reverse proxy, which forwards requests to the appropriate internal services.

---

### User Interaction Flow

1. User visits the website.
2. User signs up or logs in.
3. User selects “Connect Email.”
4. System initiates OAuth 2.0 flow with Google.
5. User grants permission.
6. Backend receives and securely stores access tokens.
7. System begins automatic email monitoring.
8. Detected phishing incidents are displayed on the dashboard.

---

### External Interaction
```mermaid
flowchart TD
    subgraph frontend [" "]
        FE["Frontend<br/>(React Container)"]
    end
    FE -->|"REST API Calls"| BE
    subgraph backend [" "]
        BE["Backend<br/>(FastAPI Container)"]
    end
    BE --> DB & WS & GM
    subgraph postgres [" "]
        DB["PostgreSQL DB<br/>(State/Queue)"]
    end
    subgraph worker [" "]
        WS["Worker Service<br/>(Container)"]
    end
    subgraph gmail [" "]
        GM["Google Gmail<br/>API + OAuth"]
    end
    DB & WS & GM --> AC
    subgraph analysis [" "]
        AC["Analysis Container<br/>(Isolated Docker)"]
    end
    classDef dashed fill:transparent,stroke:#333,stroke-width:2.5px,stroke-dasharray:5 5,rx:10,ry:10
    class frontend,backend,postgres,worker,gmail,analysis dashed
