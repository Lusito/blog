import { MarkdownArticleBody } from "../components/ArticleBody/ArticleBody";
import { ArticleDateSubTitle } from "../components/ArticleDateSubTitle/ArticleDateSubTitle";
import { ArticleHeader } from "../components/ArticleHeader/ArticleHeader";
import { Container } from "../components/Container/Container";
import { Discussions } from "../components/Discussions/Discussions";
import { MetaTagsArticle } from "../components/MetaTags/MetaTags";
import { Synopsis } from "../components/Synopsis/Synopsis";
import { TagList } from "../components/TagList/TagList";
import { DefaultLayout } from "../layouts/DefaultLayout";
import type { PageInfoMd } from "./pageUtils";

type MarkdownPageProps = {
    page: PageInfoMd;
};

export const MarkdownPage = ({ page }: MarkdownPageProps) => {
    const { title, body, tags, description, hideDate, hideSynopsis, originalSource } = page;

    const [mainTitle, subTitle] = title.split(": ");

    return (
        <DefaultLayout pageTitle={title}>
            <article>
                <MetaTagsArticle
                    title={title}
                    description={description}
                    image={page.image}
                    publishedTime={page.created}
                    modifiedTime={page.modified}
                    tags={page.tags}
                    slug={page.slug}
                />
                <ArticleHeader title={mainTitle} subTitle={subTitle} />
                {!hideDate && <ArticleDateSubTitle created={page.created} modified={page.modified} />}
                <Container>
                    {description && !hideSynopsis && <Synopsis>{description}</Synopsis>}
                    {tags.length > 0 && <TagList tags={tags} />}
                    <MarkdownArticleBody markdown={body} />
                    {originalSource && (
                        <p>
                            This post was originally published <a href={originalSource}>here.</a>
                        </p>
                    )}
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
};
