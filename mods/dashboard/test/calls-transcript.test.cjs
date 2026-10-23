const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const source = fs.readFileSync(
  path.join(__dirname, "../src/monitoring/pages/calls/call-transcript.tsx"),
  "utf8"
);
const ctx = { exports: {}, require };
vm.runInNewContext(
  ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX
    }
  }).outputText,
  ctx
);
const render = (props) =>
  renderToStaticMarkup(
    React.createElement(ctx.exports.CallTranscript, {
      transcript: "",
      recordingUrl: "",
      loading: false,
      failed: false,
      onRetry() {},
      ...props
    })
  );
test("expanded panel renders full AI/Human lines and recording link", () => {
  const html = render({
    transcript: "AI: Hello\nHuman: Hi",
    recordingUrl: "https://example.org/call.wav"
  });
  assert.match(html, /AI: Hello\nHuman: Hi/);
  assert.match(html, /Open recording/);
  assert.match(html, /white-space:pre-wrap/);
  assert.doesNotMatch(html, /No words/);
});
test("loading is distinct from no transcript", () => {
  const html = render({ loading: true });
  assert.match(html, /Loading transcript/);
  assert.doesNotMatch(html, /No words/);
});
test("empty successful result is honest", () =>
  assert.match(render({}), /No words were captured/));
test("failed read offers retry instead of claiming empty", () => {
  const html = render({ failed: true });
  assert.match(html, /Could not load/);
  assert.match(html, /Retry/);
  assert.doesNotMatch(html, /No words/);
});
test("existing transcript stays visible during refresh failure", () =>
  assert.match(
    render({ transcript: "Human: Hello", failed: true }),
    /Human: Hello/
  ));
test("dashboard Calls schema stays identical to SDK source", () => {
  for (const ext of ["js", "d.ts"])
    assert.equal(
      fs.readFileSync(
        path.join(
          __dirname,
          "../src/monitoring/services/generated/calls_pb." +
            (ext === "js" ? "cjs" : "d.cts")
        ),
        "utf8"
      ),
      fs.readFileSync(
        path.join(__dirname, "../../sdk/src/generated/web/calls_pb." + ext),
        "utf8"
      )
    );
});
