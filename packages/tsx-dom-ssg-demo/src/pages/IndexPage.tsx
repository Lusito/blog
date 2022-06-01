import { Article } from "../components/Article/Article";
import { ArticleHead } from "../components/ArticleHead/ArticleHead";
import { Container } from "../components/Container/Container";
import { DefaultLayout } from "../layouts/DefaultLayout";

export function IndexPage() {
    return (
        <DefaultLayout pageTitle="Homepage">
            <main>
                <ArticleHead title="Homepage" image="couple1.jpg" />
                <Container>
                    <Article>Here be dragons</Article>
                </Container>
            </main>
        </DefaultLayout>
    );
}
