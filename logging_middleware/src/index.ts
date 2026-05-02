export type StackType = "backend" | "frontend";
export type LevelType = "debug" | "info" | "warn" | "error" | "fatal";

export type BackendPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service";

export type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

export type SharedPackage = "auth" | "config" | "middleware" | "utils";

export type PackageType = BackendPackage | FrontendPackage | SharedPackage;

const API_URL = "http://20.207.122.201/evaluation-service/logs";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhcDA5MDJAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5OTk3MSwiaWF0IjoxNzc3Njk5MDcxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDBlZWQ3Y2YtMTRhOC00MjI2LTlhNmQtY2UzZTQzZTk3ZWVjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWRoaWwgcCBzYWplZWRoIiwic3ViIjoiYzM4ZWY3YTEtZDE0Yi00NDg5LTkxYTktYTlhZTZkYjEyZGVhIn0sImVtYWlsIjoiYXAwOTAyQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoiYWRoaWwgcCBzYWplZWRoIiwicm9sbE5vIjoicmEyMzExMDI4MDIwMDIyIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiYzM4ZWY3YTEtZDE0Yi00NDg5LTkxYTktYTlhZTZkYjEyZGVhIiwiY2xpZW50U2VjcmV0IjoiZ2ZhdFF2aFlWSGdKWXF4TSJ9.hNLSfEWpE-BuCFMJvoH3q6M388ZP5OAVPH6mlVy1FbU";

export const Log = async (
  stack: StackType,
  level: LevelType,
  pkg: PackageType,
  message: string
) => {
  // Optional runtime validation since TS types are removed at runtime
  if (stack !== "backend" && stack !== "frontend") {
    console.warn(`[Logger] Invalid stack: ${stack}`);
  }

  const payload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[Logger] Failed to send log. Status: ${response.status}`);
      const text = await response.text();
      console.error(`[Logger] Response: ${text}`);
    } else {
      // Optional: uncomment for debugging
      // const data = await response.json();
      // console.log("[Logger] Log sent successfully", data.logID);
    }
  } catch (error) {
    console.error("[Logger] Network error while sending log:", error);
  }
};
