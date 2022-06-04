import { MarkdownArticle } from "../components/Article/Article";
import { ArticleHead } from "../components/ArticleHead/ArticleHead";
import { Container } from "../components/Container/Container";
import { MetaTagsArticle } from "../components/MetaTags/MetaTags";
import { TagList } from "../components/TagList/TagList";
import { DefaultLayout } from "../layouts/DefaultLayout";
import type { PageInfoMd } from "./pageUtils";

type MarkdownPageProps = {
    page: PageInfoMd;
};

export async function MarkdownPage({ page }: MarkdownPageProps) {
    const { title, body, tags, description } = page;
    return (
        <DefaultLayout pageTitle={title}>
            <main>
                <MetaTagsArticle
                    title={title}
                    description={description}
                    image={page.image}
                    publishedTime={page.date}
                    tags={page.tags}
                    slug={page.slug}
                />
                <ArticleHead title={title} description={description} date={page.date} />
                <Container>
                    {tags.length > 0 && <TagList tags={tags} />}
                    <MarkdownArticle markdown={body} />
                    {tags.length > 0 && (
                        <>
                            <TagList tags={tags} />
                            {/* <div>giscus</div> */}
                        </>
                    )}
                </Container>
            </main>
        </DefaultLayout>
    );
}
