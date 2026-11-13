/*
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// IVX Voice Studio self-host: never fall back to Fonoster Cloud.
// Production images must also bake DASHBOARD_API_URL, and the kube
// selfhost-patch rewrites any leftover api.fonoster.com in the bundle.
const { origin, hostname, port } = new URL(
  import.meta.env.DASHBOARD_API_URL || "https://fonoster.intelli-verse-x.ai"
);

export const FONOSTER_CLIENT_CONFIG = Object.freeze({
  url: origin,
  accessKeyId: "",
  allowInsecure: Boolean(import.meta.env.DASHBOARD_ALLOW_INSECURE === "true")
});

export const FONOSTER_SERVER_CONFIG = Object.freeze({
  endpoint: `${hostname}${port ? `:${port}` : ""}`,
  accessKeyId: "",
  allowInsecure: Boolean(import.meta.env.DASHBOARD_ALLOW_INSECURE === "true"),
  accessToken: ""
});

/**
 * Native gRPC (Node SDK) only works against apiserver :50051 (in-cluster / port-forward).
 * Public ALB + Envoy speaks grpc-web over HTTP/1.1 — Node gRPC gets HTTP 464.
 */
export const USE_NATIVE_GRPC =
  FONOSTER_SERVER_CONFIG.endpoint.includes(":50051");

/**
 * Self-hosted Voice Studio must not fall back to app.fonoster.com — that
 * sends reset emails to the wrong product. Prefer build arg, then this host.
 */
export const FONOSTER_RESET_PASSWORD_URL: string =
  import.meta.env.DASHBOARD_RESET_PASSWORD_URL ||
  "https://fonoster.intelli-verse-x.ai/auth/reset-password";

/** Prefer the live dashboard origin so local / preview hosts still work. */
export function resolveResetPasswordUrl(): string {
  const fromEnv = String(
    import.meta.env.DASHBOARD_RESET_PASSWORD_URL || ""
  ).trim();
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/auth/reset-password`;
  }
  return FONOSTER_RESET_PASSWORD_URL;
}

export const IS_CLOUD = Boolean(import.meta.env.DASHBOARD_EDITION === "cloud");
export const IS_PRIVATE_BETA = Boolean(
  import.meta.env.DASHBOARD_PRIVATE_BETA_ENABLED === "true"
);
export const IS_SIGNUP_ENABLED = IS_CLOUD && !IS_PRIVATE_BETA;
