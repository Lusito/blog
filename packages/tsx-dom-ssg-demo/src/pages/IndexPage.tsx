import { Article } from "../components/Article/Article";
import { Container } from "../components/Container/Container";
import { DefaultLayout } from "../layouts/DefaultLayout";

export function IndexPage() {
    return (
        <DefaultLayout pageTitle="Homepage">
            <main>
                <Container>
                    <Article title="Homepage">Here be dragons</Article>
                </Container>
            </main>
        </DefaultLayout>
    );
}
