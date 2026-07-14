import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// TEMPORARY — "https://b120tdgae25c9y9ggu6pze9w.178.105.149.221.sslip.io" is
// this project's Coolify-generated preview URL, allowed only until
// lakesidetaxi.co.uk is wired up as the real domain. Remove that entry once
// the real domain is live and traffic no longer needs the preview URL.
const ALLOWED_ORIGINS = [
  "https://lakesidetaxi.co.uk",
  "https://b120tdgae25c9y9ggu6pze9w.178.105.149.221.sslip.io",
];
const DEV_ORIGIN_PATTERN = /^http:\/\/localhost:\d+$/;

app.use(cors({
  origin(origin, callback) {
    // No Origin header (same-origin requests, curl, healthchecks) — allow.
    if (!origin) {
      callback(null, true);
      return;
    }
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }
    if (process.env.NODE_ENV !== "production" && DEV_ORIGIN_PATTERN.test(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));

app.use(express.json({
  // Square's webhook signature covers the exact raw request bytes — stash
  // them here so that one route can verify against them. Every other route
  // just uses req.body as normal; this has no effect on them. body-parser
  // types this callback's req as the raw http.IncomingMessage, not Express's
  // Request, but it's the same underlying object at runtime.
  verify: (req, _res, buf) => {
    (req as typeof req & { rawBody?: Buffer }).rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: true }));

const PgSession = connectPgSimple(session);
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required but was not provided.");
}

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "admin_sessions",
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
    },
  }),
);

app.use("/api", router);

app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  req.log?.error({ err }, "Unhandled error in request handler");
  if (res.headersSent) return;
  res.status(500).json({ error: "Something went wrong. Please try again or call us directly." });
});

export default app;
