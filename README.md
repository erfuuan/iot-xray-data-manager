## 📌 **Iot-xray-Data-Manager - Production Setup Guide**  

To run this project in **production mode**, follow these steps carefully:  

### 🚀 **1. Setup Project on Server**  
Move the **Docker Compose** file to your server in a directory like `/app`:  
```bash
scp docker-compose.yml user@your-server:/app/
```

### 📂 **2. Place Configuration Files**  
Ensure the following files are inside `/app`:  
- `docker-compose.yml`
- `rabbitmq.conf`
- `.env` files  

### 🔧 **3. Setup Environment Files**  

#### **Main `.env` File**  
Move `.env.example` from the root of the **Iot-xray-Data-Manager** repo and rename it as `.env` in `/app`:  
```bash
mv /path/to/Iot-xray-Data-Manager/.env.example /app/.env
```

#### **Process Service `.env` File**  
Move `.env.example` from the **process** directory and rename it as `.env`:  
```bash
mv /path/to/Iot-xray-Data-Manager/process/.env.example /app/.env
```

#### **Agent Service `.env` File**  
Move `.env.example` from the **agent** directory and rename it as `.env`:  
```bash
mv /path/to/Iot-xray-Data-Manager/agent/.env.example /app/.env
```

### 🔑 **4. Configure Environment Variables**  
Edit the `.env` files to set the desired values.

#### **Example `.agent.env`**  
```ini
AGENT_ID=test1

RABBITMQ_URL=amqp://myuser:mypass@rabbitmq:5672
RABBITMQ_QUEUE=test01   
                       
RABBITMQ_QUEUE_DURABLE=0
```

#### **Example process `.env`**  

```ini
MONGO_URI=mongodb://mongo:27017/Iot-xray-Data-Manager

RABBITMQ_QUEUE_DURABLE=0

RABBITMQ_URL=amqp://myuser:mypass@rabbitmq:5672
RABBITMQ_QUEUE=test01

PORT=3000             
```

### ✅ **5. Run the Service in Detached Mode**  
Start all services using Docker Compose:  
```bash
docker compose up -d
```

Now your services are running! 🎉 🚀
