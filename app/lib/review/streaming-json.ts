export const streamingJSONType = "application/x-ndjson";

export function streamJSON(run: (signal: AbortSignal) => Promise<unknown>, signal: AbortSignal) {
  const encoder = new TextEncoder();
  const heartbeat = encoder.encode("\n");
  const cancellation = new AbortController();
  let timer: ReturnType<typeof setInterval>;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(heartbeat);
      timer = setInterval(() => controller.enqueue(heartbeat), 10000);
      void run(AbortSignal.any([signal, cancellation.signal]))
        .then((result) => {
          if (cancellation.signal.aborted) return;
          controller.enqueue(encoder.encode(JSON.stringify(result) + "\n"));
          controller.close();
        })
        .catch((error) => {
          if (!cancellation.signal.aborted) controller.error(error);
        })
        .finally(() => clearInterval(timer));
    },
    cancel() {
      clearInterval(timer);
      cancellation.abort();
    },
  });
  // Empty lines keep the connection active while the final JSON object is computed.
  return new Response(stream, {
    headers: {
      "Content-Type": streamingJSONType,
      "Cache-Control": "no-store, no-transform",
    },
  });
}
