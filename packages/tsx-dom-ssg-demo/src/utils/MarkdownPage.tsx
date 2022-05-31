import { MarkdownArticle } from "../components/Article/Article";
import { Container } from "../components/Container/Container";
import { DefaultLayout } from "../layouts/DefaultLayout";
import type { PageInfoMd } from "./getPages";

type MarkdownPageProps = {
    page: PageInfoMd;
};

export async function MarkdownPage({ page }: MarkdownPageProps) {
    const { title, body, tags } = page;
    return (
        <DefaultLayout pageTitle={title}>
            <main>
                <Container>
                    <MarkdownArticle markdown={body} />
                    <div>Tags: {tags.join(",")}</div>
                    <div>giscus</div>
                </Container>
            </main>
        </DefaultLayout>
    );
}
