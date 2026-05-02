import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { Log } from "logging-middleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Global logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  Log("backend", "info", "middleware", `Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  Log("backend", "info", "route", "Handling request for root route");
  res.send({ status: "ok", message: "Backend is running!" });
});

app.get("/error", (req: Request, res: Response) => {
  Log("backend", "error", "route", "Simulating an error response");
  res.status(500).send({ status: "error", message: "An error occurred" });
});

app.get("/db-simulate", (req: Request, res: Response) => {
  // Simulating a DB fatal error
  Log("backend", "fatal", "db", "Critical database connection failure.");
  res.status(503).send({ status: "error", message: "Database unavailable" });
});

app.listen(PORT, () => {
  Log("backend", "info", "service", `Server started on http://localhost:${PORT}`);
  console.log(`Server started on http://localhost:${PORT}`);
});
