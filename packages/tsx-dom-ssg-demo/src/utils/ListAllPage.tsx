import { ArticleHead } from "../components/ArticleHead/ArticleHead";
import { Container } from "../components/Container/Container";
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
            <main>
                <MetaTags description={description} slug="all" title={title} tags={tagLabels} />
                <ArticleHead title={title} description={description} />
                <Container>
                    <ul>
                        {pages.map((page) => (
                            <li>
                                <a href={`/${page.slug}.html`}>{page.title}</a> ({page.date.toDateString()})
                            </li>
                        ))}
                    </ul>
                </Container>
            </main>
        </DefaultLayout>
    );
}
