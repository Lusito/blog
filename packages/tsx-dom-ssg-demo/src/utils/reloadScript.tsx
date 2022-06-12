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
            setTimeout(connect, 500);
        };
    }
    connect();
}

export const reloadScript =
    process.env.NODE_ENV === "production" ? null : <script dangerouslySetInnerHTML={`(${initSSE})()`} />;
