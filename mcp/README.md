# fonoster-mcp

MCP server for **Fonoster** voice + AI voice agents (Intelli-Verse engagement stack).

Fonoster exposes gRPC (no REST), so this wraps `@fonoster/sdk` over gRPC to the in-cluster
`fonoster-apiserver`. Transport: MCP JSON-RPC 2.0 over HTTP (`POST /`), liveness `GET /healthz`.

**Auth (per-request):** `Authorization: Bearer <accessKeyId>:<apiKey>:<apiSecret>` — one
deployment serves every workspace; nothing is baked in.

Tools: list/get applications, numbers, agents, calls; create outbound call. See `server.js`.
