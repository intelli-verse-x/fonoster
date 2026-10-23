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
import { SDK } from "~/core/sdk/client/fonoster.client";
import type { CallDetailRecord } from "@fonoster/types";
export type TranscriptCall = CallDetailRecord & {
  transcript?: string;
  recordingUrl?: string;
};

import * as grpcWeb from "grpc-web";
import * as pb from "./generated/calls_pb.cjs";

/**
 * The published SDK predates transcript fields 16/17. Keep its authentication,
 * refresh interceptor and object mapping, but decode read RPCs with our schema.
 * Generated files are copied from mods/sdk/src/generated/web/calls_pb.*.
 */
export function callsReader(client: SDK.WebClient): SDK.Calls {
  const transport = client.getCallsClient();
  Object.assign(transport, {
    methodDescriptorListCalls: new grpcWeb.MethodDescriptor(
      "/fonoster.calls.v1beta2.Calls/ListCalls",
      grpcWeb.MethodType.UNARY,
      pb.ListCallsRequest,
      pb.ListCallsResponse,
      (request: pb.ListCallsRequest) => request.serializeBinary(),
      pb.ListCallsResponse.deserializeBinary
    ),
    methodDescriptorGetCall: new grpcWeb.MethodDescriptor(
      "/fonoster.calls.v1beta2.Calls/GetCall",
      grpcWeb.MethodType.UNARY,
      pb.GetCallRequest,
      pb.CallDetailRecord,
      (request: pb.GetCallRequest) => request.serializeBinary(),
      pb.CallDetailRecord.deserializeBinary
    )
  });
  const readerClient = Object.create(client) as SDK.WebClient;
  readerClient.getCallsClient = () => transport;
  return new SDK.Calls(readerClient);
}
