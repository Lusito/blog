function initSSE() {
    let lastId = "";
    function connect() {
        const evtSource = new EventSource("/hot-sse");
        evtSource.onmessage = (event) => {
            if (lastId && lastId !== event.data) {
                window.location.reload();
            }
            lastId = event.data;
        };
        evtSource.onerror = () => {
            evtSource.close();
            connectWhenReady();
        };
    }

    async function connectWhenReady(delayAfterError = 500) {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort(new Error("timeout"));
        }, 100);
        try {
            const response = await fetch("/health", { signal: controller.signal });
            if (!response.ok) throw new Error("Not ready yet");
            const message = await response.json();
            if (message === "ready") return connect();
        } catch {
            // ignore
        } finally {
            clearTimeout(timeout);
        }
        await new Promise((resolve) => {
            setTimeout(resolve, delayAfterError);
        });

        return connectWhenReady(Math.min(3000, delayAfterError * 2));
    }
    connectWhenReady();
}

export const reloadScript =
    process.env.NODE_ENV === "production" ? null : <script dangerouslySetInnerHTML={`(${initSSE})()`} />;
