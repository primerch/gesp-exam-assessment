import test from "node:test";
import assert from "node:assert/strict";
import { streamJSON, streamingJSONType } from "../app/lib/review/streaming-json";

test("analysis response sends a heartbeat before returning its JSON result", async () => {
  const result = Promise.withResolvers<{ success: true }>();
  const response = streamJSON(() => result.promise, new AbortController().signal);
  assert.equal(response.headers.get("content-type"), streamingJSONType);
  assert(response.body);
  const reader = response.body.getReader();
  try {
    const decoder = new TextDecoder();
    assert.equal(decoder.decode((await reader.read()).value), "\n");
    result.resolve({ success: true });
    assert.deepEqual(JSON.parse(decoder.decode((await reader.read()).value)), { success: true });
    assert.equal((await reader.read()).done, true);
  } finally {
    await reader.cancel();
  }
});

test("a disconnected browser aborts the in-flight analysis", async () => {
  let operationSignal: AbortSignal | undefined;
  const response = streamJSON((signal) => {
    operationSignal = signal;
    return new Promise((resolve) => signal.addEventListener("abort", resolve, { once: true }));
  }, new AbortController().signal);

  assert(response.body);
  await response.body.cancel();
  assert.equal(operationSignal?.aborted, true);
});
