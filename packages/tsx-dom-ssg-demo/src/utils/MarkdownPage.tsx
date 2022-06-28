import { MarkdownArticleBody } from "../components/ArticleBody/ArticleBody";
import { ArticleHeader } from "../components/ArticleHeader/ArticleHeader";
import { Container } from "../components/Container/Container";
import { Discussions } from "../components/Discussions/Discussions";
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
            <article>
                <MetaTagsArticle
                    title={title}
                    description={description}
                    image={page.image}
                    publishedTime={page.date}
                    tags={page.tags}
                    slug={page.slug}
                />
                <ArticleHeader title={title} description={description} date={page.date} />
                <Container>
                    {tags.length > 0 && <TagList tags={tags} />}
                    <MarkdownArticleBody markdown={body} />
                    {tags.length > 0 && (
                        <>
                            <TagList tags={tags} />
                            <Discussions />
                        </>
                    )}
                </Container>
            </article>
        </DefaultLayout>
    );
}
