import { ComponentThis, createContext } from "tsx-dom-ssr";

import { DefaultLayout } from "../layouts/DefaultLayout";

// This example shows how to make sure components start their work when the previous one has finished rather than in parallel.
// This can be useful in certain scenarios. For example:
// Imagine you have a news-website, which shows lists of teasers (previews for articles).
// Each list may only contain teasers, which have not been already been shown.
// It's also important to finish the lists from top to bottom, since the newest article teasers should be shown at the top of the page.
// In order to do that, the first list needs to do its query, register used ids and then let the next list do its query (while ignoring the used ids).

const SequentialContext = createContext({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    start: () => Promise.resolve(() => {}),
});

type SequentialProps = {
    id: number;
    delay: number;
};

export async function Sequential(this: ComponentThis, { id, delay }: SequentialProps) {
    const sequential = SequentialContext.for(this);
    const endSequential = await sequential.start();
    const beginTime = Date.now();
    await new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
    endSequential();

    return (
        <div>
            {id}: {beginTime}-{Date.now()}
        </div>
    );
}

export function SequentialPage() {
    let active = 0;
    const pending: Array<() => void> = [];
    const sequential = {
        start(): Promise<() => void> {
            let done = false;
            const end = () => {
                if (!done) {
                    done = true;
                    active--;
                    pending.shift()?.();
                }
            };
            if (active) {
                return new Promise((resolve) => pending.push(() => resolve(end)));
            }
            active++;
            return Promise.resolve(end);
        },
    };

    return (
        <DefaultLayout title="Sequential">
            <SequentialContext.Provider value={sequential}>
                <Sequential id={1} delay={500} />
                <Sequential id={2} delay={200} />
                <Sequential id={3} delay={100} />
            </SequentialContext.Provider>
        </DefaultLayout>
    );
}
