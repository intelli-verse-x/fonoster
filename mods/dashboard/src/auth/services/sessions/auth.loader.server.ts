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
import { data } from "react-router";
import {
  commitSession,
  destroySession,
  getSession,
  getSessionCookie
} from "./session.server";
import type { Route } from "../../../+types/root";
import {
  isTokenExpired,
  refreshSession
} from "~/core/helpers/token-validators";
import { getClient } from "~/core/sdk/client/fonoster.server";
import { USE_NATIVE_GRPC } from "~/core/sdk/stores/fonoster.config";

export const rootAuthLoader = async ({ request }: Route.LoaderArgs) => {
  const headers = request.headers.get("Cookie");
  const { session, ...rest } = await getSession(headers);
  const sessionCookie = await getSessionCookie(headers);

  try {
    if (session) {
      if (USE_NATIVE_GRPC) {
        // In-cluster / port-forward: refresh via Node gRPC.
        const client = getClient();
        const refreshToken = await refreshSession(session, client);
        sessionCookie.set("refreshToken", refreshToken);
      } else {
        // Public ALB: Node gRPC returns HTTP 464. Keep the cookie if the JWT
        // is still valid; the browser WebClient refreshes over grpc-web.
        if (isTokenExpired(session.refreshToken)) {
          throw new Error("Oops! Your session has expired.");
        }
        sessionCookie.set("refreshToken", session.refreshToken);
      }
    }
  } catch (error) {
    return data(
      { session: null, ...rest },
      { headers: { "Set-Cookie": await destroySession(sessionCookie) } }
    );
  }

  return data(
    { session, ...rest },
    { headers: { "Set-Cookie": await commitSession(sessionCookie) } }
  );
};
