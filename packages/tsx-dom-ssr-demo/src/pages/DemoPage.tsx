import { ErrorBoundary } from "tsx-dom-ssr";

import { LazyImage } from "../components/LazyImage/LazyImage";
import { SomeNumber } from "../contexts/SomeNumber";
import { CustomError } from "../CustomError";
import { DefaultLayout } from "../layouts/DefaultLayout";

export function DemoPage() {
    return (
        <DefaultLayout title="Providers">
            <SomeNumber.Provider value={20}>
                <LazyImage src="hello.png" />
                <ErrorBoundary
                    render={() => (
                        <ErrorBoundary
                            render={() => <div />}
                            fallback={({ error }) => <h2>Error 1: {String(error)}</h2>}
                            accept={(error) => !(error instanceof CustomError)}
                        />
                    )}
                    fallback={({ error }) => <h2>Error 2: {String(error)}</h2>}
                />
            </SomeNumber.Provider>
        </DefaultLayout>
    );
}
