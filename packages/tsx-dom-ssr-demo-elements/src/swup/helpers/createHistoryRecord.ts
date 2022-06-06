export const createHistoryRecord = (url: string) => {
    window.history.pushState(
        {
            url: url || window.location.href.split(window.location.hostname)[1],
            random: Math.random(),
            source: "swup",
        },
        document.title,
        url || window.location.href.split(window.location.hostname)[1]
    );
};
