# 📬 Newsletter Subscription App with BullMQ & OpenTelemetry

A **Node.js + TypeScript** application demonstrating full-stack tracing of newsletter subscriptions using **BullMQ** queues and **OpenTelemetry** instrumentation. This app shows how to trace requests from the API layer through background processing to database storage.

### 📁 Project Structure

```text
src/
├── controllers/
│ └── newsletter.controller.ts
├── jobs/
│ └── newsletter.worker.ts
├── instrumentation/
│ ├── instrumentation.server.ts
│ └── instrumentation.consumer.ts
├── services/
│ └── newsletter.service.ts
├── database/
│ └── index.ts
├── routes/
│ └── newsletter.routes.ts
└── index.ts
```

---

## 🚀 Features

- Express API to **subscribe/unsubscribe** users to newsletters.
- BullMQ for **background job processing** of subscriptions.
- PostgreSQL database for persistent subscriber storage.
- **BullMQ-Otel** instrumentation for complete end-to-end distributed tracing.
- Auto-instrumentation of Express, HTTP, Redis, and Postgres operations.

---

## 🧠 Learning Outcomes

✅ Integrate OpenTelemetry with Express, Redis, and Postgres  
✅ Capture and visualize distributed traces end-to-end  
✅ Configure BullMQ instrumentation for detailed job lifecycle telemetry  
✅ Build a scalable, observable background processing pipeline

---

## 🔎 Observability

Once running, traces from Express API calls through BullMQ workers and Postgres interactions will be exported to your configured OTEL collector.

You can visualize these traces using tools like:

- [Jaeger UI](https://www.jaegertracing.io/docs/latest/getting-started/)
- [Grafana Tempo](https://grafana.com/oss/tempo/)

---

## 🔁 Transaction Simulation

To test different outcomes on the **Checkout Page**:
| Input Value | Outcome |
|-------------|--------------------|
| `1` | ✅ Approved |
| `2` | ❌ Declined |
| `3` | ⚠️ Gateway Failure |

- CVV: Any 3-digit number
- Expiry Date: Any future date

---

## 📝 Example: BullMQ Worker Instrumentation

```typescript
import { Worker } from "bullmq";
import { BullMQOtel } from "bullmq-otel";

const worker = new Worker("newsletter", jobHandler, {
  connection: redisConfig,
  telemetry: new BullMQOtel("newsletter-tracer"),
});
```

## 📦 Requirements

- Node.js (v18+ recommended)
- Redis
- PostgreSQL
- OpenTelemetry Collector (e.g., [Grafana OTEL Collector](https://grafana.com/oss/otel/collector/)) or Jaeger backend

---

## 🛠️ Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd newsletter-app
   npm install
   ```

2. **Create a `.env` file** with your configuration:

   ```env
   PORT=3000
   REDIS_URL=redis://localhost:6379
   DATABASE_URL=postgresql://user:password@localhost:5432/newsletter
   OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318
   ```

3. **Run supporting services** with Docker Compose:

   ```bash
   docker-compose up
   ```

4. **Start the application**:

   ```bash
   npm run start
   ```

5. **Test the subscription endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/newsletter/subscribe \
     -H 'Content-Type: application/json' \
     -d '{"email":"user@example.com"}'
   ```
