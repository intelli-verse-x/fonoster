const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { buildSync } = require("esbuild");
test("published SDK transport decodes transcript for list and detail with current descriptors", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "calls-reader-"));
  const out = path.join(dir, "reader.cjs");
  fs.writeFileSync(
    path.join(dir, "sdk.ts"),
    `import * as SDK from ${JSON.stringify(require.resolve("@fonoster/sdk/dist/web/index.esm.js"))}; export { SDK };`
  );
  try {
    buildSync({
      entryPoints: [
        path.join(__dirname, "../src/monitoring/services/calls-reader.ts")
      ],
      outfile: out,
      bundle: true,
      platform: "node",
      format: "cjs",
      alias: { "~/core/sdk/client/fonoster.client": path.join(dir, "sdk.ts") }
    });
    const { callsReader } = require(out);
    // SDK accepts a structurally compatible client; callbacks decode actual wire bytes.
    const loader = require("@grpc/proto-loader");
    const def = loader.loadSync(
      path.join(__dirname, "../../common/src/protos/calls.proto")
    );
    const service = def["fonoster.calls.v1beta2.Calls"];
    const metadata = { token: "test-token", accessKeyId: "test-workspace" };
    const transport = {
      listCalls(req, meta, cb) {
        assert.equal(meta, metadata);
        cb(
          null,
          this.methodDescriptorListCalls.b(
            service.ListCalls.responseSerialize({
              items: [
                {
                  ref: "one",
                  transcript: "AI: Hello\nHuman: Hi",
                  recordingUrl: "https://example.org/r.wav"
                }
              ]
            })
          )
        );
      },
      getCall(req, meta, cb) {
        assert.equal(meta, metadata);
        cb(
          null,
          this.methodDescriptorGetCall.b(
            service.GetCall.responseSerialize({
              ref: "one",
              transcript: "Human: Hi",
              recordingUrl: "https://example.org/r.wav"
            })
          )
        );
      }
    };
    const reader = callsReader({
      getMetadata: () => metadata,
      getCallsClient: () => transport
    });
    const listed = await reader.listCalls({});
    const detail = await reader.getCall("one");
    assert.equal(listed.items[0].transcript, "AI: Hello\nHuman: Hi");
    assert.equal(detail.transcript, "Human: Hi");
    assert.equal(detail.recordingUrl, "https://example.org/r.wav");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
