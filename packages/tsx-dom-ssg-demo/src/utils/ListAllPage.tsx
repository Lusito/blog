import { ArticleHead } from "../components/ArticleHead/ArticleHead";
import { Container } from "../components/Container/Container";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { PageInfo } from "./pageUtils";

type ListAllPageProps = {
    pages: PageInfo[];
};

export async function ListAllPage({ pages }: ListAllPageProps) {
    const title = "All Posts";
    return (
        <DefaultLayout pageTitle={title}>
            <main>
                <ArticleHead title={title} description="A list of all posts on this blog" />
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
