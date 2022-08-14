import { ArticleHeader } from "../components/ArticleHeader/ArticleHeader";
import { Container } from "../components/Container/Container";
import { DateTime } from "../components/DateTime/DateTime";
import { MetaTags } from "../components/MetaTags/MetaTags";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { PageInfo, tagLabels } from "./pageUtils";

type ListAllPageProps = {
    pages: PageInfo[];
};

export async function ListAllPage({ pages }: ListAllPageProps) {
    const title = "All Posts";
    const description = "A chronological list of posts on this blog";
    return (
        <DefaultLayout pageTitle={title}>
            <article>
                <MetaTags description={description} slug="all" title={title} tags={tagLabels} />
                <ArticleHeader title={title} subTitle={<p>{description}</p>} />
                <Container>
                    <ul>
                        {pages.map((page) => (
                            <li>
                                <a href={`/${page.slug}.html`}>{page.title}</a> (<DateTime date={page.created} />)
                            </li>
                        ))}
                    </ul>
                </Container>
            </article>
        </DefaultLayout>
    );
}
