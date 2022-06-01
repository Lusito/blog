import { MarkdownArticle } from "../components/Article/Article";
import { ArticleHead } from "../components/ArticleHead/ArticleHead";
import { Container } from "../components/Container/Container";
import { OpenGraphArticle } from "../components/OpenGraph/OpenGraph";
import { TagList } from "../components/TagList/TagList";
import { DefaultLayout } from "../layouts/DefaultLayout";
import type { PageInfoMd } from "./getPages";

type MarkdownPageProps = {
    page: PageInfoMd;
};

export async function MarkdownPage({ page }: MarkdownPageProps) {
    const { title, body, tags, description } = page;
    return (
        <DefaultLayout pageTitle={title}>
            <main>
                <OpenGraphArticle
                    title={title}
                    description={description}
                    image={page.image}
                    publishedTime={page.date}
                    tags={page.tags}
                    slug={page.slug}
                />
                <ArticleHead title={title} image={page.image} description={description} />
                <Container>
                    <TagList tags={tags} />
                    <MarkdownArticle markdown={body} />
                    <TagList tags={tags} />
                    <div>giscus</div>
                </Container>
            </main>
        </DefaultLayout>
    );
}
