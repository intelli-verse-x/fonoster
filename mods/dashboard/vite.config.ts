/**
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
import path from "node:path";
import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const dashboardRoot = path.dirname(fileURLToPath(import.meta.url));
const callsPbCjs = path.resolve(
  dashboardRoot,
  "src/monitoring/services/generated/calls_pb.cjs"
);

/**
 * Vite's SSR module runner evaluates local .cjs without a CommonJS `require`,
 * which throws "require is not defined" for google-protobuf generated code.
 * On SSR, replace that file with an ESM shim that uses Node createRequire.
 */
function ssrCallsPbRequireShim(): Plugin {
  const virtualId = "\0fonoster-ssr-calls-pb";

  return {
    name: "ssr-calls-pb-require-shim",
    enforce: "pre",
    resolveId(id, _importer, options) {
      if (!options?.ssr) return;
      const normalized = id.replace(/\\/g, "/");
      if (
        id === callsPbCjs ||
        normalized === callsPbCjs.replace(/\\/g, "/") ||
        normalized.endsWith("/monitoring/services/generated/calls_pb.cjs") ||
        normalized.endsWith("/generated/calls_pb.cjs")
      ) {
        return virtualId;
      }
    },
    load(id) {
      if (id !== virtualId) return;
      const file = JSON.stringify(callsPbCjs);
      return `
import { createRequire } from "node:module";
const require = createRequire(${file});
const __pb = require(${file});
export const ListCallsRequest = __pb.ListCallsRequest;
export const ListCallsResponse = __pb.ListCallsResponse;
export const GetCallRequest = __pb.GetCallRequest;
export const CallDetailRecord = __pb.CallDetailRecord;
export const CreateCallRequest = __pb.CreateCallRequest;
export const CreateCallResponse = __pb.CreateCallResponse;
export const TrackCallRequest = __pb.TrackCallRequest;
export const TrackCallResponse = __pb.TrackCallResponse;
export const CallType = __pb.CallType;
export const CallStatus = __pb.CallStatus;
export const CallDirection = __pb.CallDirection;
export default __pb;
`;
    }
  };
}

export default defineConfig({
  plugins: [ssrCallsPbRequireShim(), reactRouter(), tsconfigPaths()],
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime"]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /services\/generated\/calls_pb\.cjs$/]
    }
  },
  ssr: {
    noExternal: ["@mui/*", "@emotion/*"]
  },
  optimizeDeps: {
    include: ["@mui/*", "@emotion/*"],
    force: true
  },
  server: {
    port: 3030,
    strictPort: true
  },
  envPrefix: "DASHBOARD_"
});
