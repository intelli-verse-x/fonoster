/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Server-side password login for portal auto-login and form POSTs that do not
 * already carry a browser refresh token. Public ALB + Envoy only speak
 * grpc-web — Node gRPC against that edge returns HTTP 464. Prefer the
 * in-cluster apiserver endpoint when FONOSTER_GRPC_ENDPOINT is set.
 */
import * as SDK from "@fonoster/sdk/dist/node/node.js";
import {
  FONOSTER_SERVER_CONFIG,
  USE_NATIVE_GRPC
} from "~/core/sdk/stores/fonoster.config";
import { Logger } from "~/core/shared/logger";

function serverLoginEndpoint(): string {
  const fromEnv = String(
    process.env.FONOSTER_GRPC_ENDPOINT ||
      process.env.DASHBOARD_GRPC_ENDPOINT ||
      ""
  )
    .trim()
    .replace(/^https?:\/\//, "");
  if (fromEnv) return fromEnv;
  if (USE_NATIVE_GRPC) return FONOSTER_SERVER_CONFIG.endpoint;
  // Cluster default used by Voice Studio (see kube fonoster-dashboard env).
  return "fonoster-apiserver:50051";
}

/**
 * Exchange email/password for a refresh token using native gRPC against the
 * apiserver the dashboard pod can reach.
 */
export async function loginWithPasswordOnServer(
  email: string,
  password: string
): Promise<string> {
  const endpoint = serverLoginEndpoint();
  Logger.debug("[server-login] authenticating against", { endpoint });
  const client = new SDK.Client({
    endpoint,
    accessKeyId: "",
    allowInsecure: true
  });
  await client.login(email, password);
  const refreshToken = client.getRefreshToken();
  if (!refreshToken) {
    throw new Error("Login succeeded but no refresh token was returned.");
  }
  return refreshToken;
}
