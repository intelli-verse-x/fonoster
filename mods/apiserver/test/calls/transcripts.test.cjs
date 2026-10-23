const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
function load(name) {
  const source = fs.readFileSync(
    path.join(__dirname, "../../src/calls", name + ".ts"),
    "utf8"
  );
  const context = {
    exports: {},
    __filename: name,
    require(id) {
      if (id === "@fonoster/common")
        return {
          INFLUXDB_CALLS_BUCKET: "calls",
          CALL_DETAIL_RECORD_MEASUREMENT: "cdr"
        };
      if (id === "@fonoster/logger")
        return { getLogger: () => ({ verbose() {}, warn() {} }) };
      if (id.startsWith("./")) return load(id.slice(2));
      return require(id);
    }
  };
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2017
      }
    }).outputText,
    context
  );
  return context.exports;
}
const attach = load("attachCallTranscripts").attachCallTranscripts;
const call = {
  ref: "one",
  startedAt: 1792755000,
  endedAt: 1792755000,
  duration: 0
};
const row = {
  ref: "one",
  _time: new Date(1792755160000).toISOString(),
  transcript: "AI: Hello\nHuman: Hi",
  recordingUrl: "https://example.org/recording.wav"
};
test("latest per ref wins independently of row ordering; unrelated refs never attach", async () => {
  for (const rows of [
    [row, { ...row, _time: "2026-10-01T00:00:00Z", transcript: "old" }],
    [{ ...row, _time: "2026-10-01T00:00:00Z", transcript: "old" }, row]
  ]) {
    const result = await attach(
      {
        collectRows: async (q) => {
          assert.match(q.toString(), /rowKey: \["ref", "_time"\]/);
          assert.match(
            q.toString(),
            /sort\(columns: \["_time"\], desc: true\)/
          );
          return rows;
        }
      },
      [call, { ...call, ref: "other" }]
    );
    assert.equal(result[0].transcript, row.transcript);
    assert.equal(result[0].duration, 160);
    assert.equal(result[1].transcript, undefined);
  }
});
test("terminal status and measured duration survive enrichment", async () => {
  const result = await attach({ collectRows: async () => [row] }, [
    { ...call, endedAt: 1792755040, status: "USER_BUSY" }
  ]);
  assert.equal(result[0].duration, 40);
  assert.equal(result[0].status, "USER_BUSY");
});
test("missing transcript and query outage preserve the call", async () => {
  for (const collectRows of [
    async () => [],
    async () => {
      throw Error("offline");
    }
  ])
    assert.equal((await attach({ collectRows }, [call]))[0], call);
});
test("empty results do not query transcripts", async () =>
  assert.equal(
    (await attach({ collectRows: () => assert.fail("unexpected query") }, []))
      .length,
    0
  ));
for (const method of ["createFetchCalls", "createFetchSingleCall"])
  test(
    method + " returns transcript and recording for the authorized CDR",
    async () => {
      let count = 0;
      const fetch = load(method)[method]({
        collectRows: async (q) => {
          count++;
          if (count === 1) {
            assert.match(q.toString(), /accessKeyId/);
            return [call];
          }
          return [row];
        }
      });
      const result = await fetch(
        "workspace",
        method === "createFetchCalls" ? {} : "one"
      );
      const item = result.items ? result.items[0] : result;
      assert.equal(item.transcript, row.transcript);
      assert.equal(item.recordingUrl, row.recordingUrl);
      assert.equal(item.duration, 160);
    }
  );
test("missing/unauthorized getCall does not query transcript", async () => {
  let count = 0;
  const result = await load("createFetchSingleCall").createFetchSingleCall({
    collectRows: async () => {
      count++;
      return [];
    }
  })("other", "one");
  assert.equal(result, null);
  assert.equal(count, 1);
});
test("both RPC wire responses retain transcript and recording", () => {
  const loader = require("@grpc/proto-loader");
  const def = loader.loadSync(
    path.join(__dirname, "../../../common/src/protos/calls.proto"),
    { keepCase: false }
  );
  const service = def["fonoster.calls.v1beta2.Calls"];
  for (const name of ["ListCalls", "GetCall"]) {
    const method = service[name];
    const input =
      name === "ListCalls"
        ? { items: [{ ...call, ...row }] }
        : { ...call, ...row };
    const output = method.responseDeserialize(method.responseSerialize(input));
    const item = output.items ? output.items[0] : output;
    assert.equal(item.transcript, row.transcript);
    assert.equal(item.recordingUrl, row.recordingUrl);
  }
});
