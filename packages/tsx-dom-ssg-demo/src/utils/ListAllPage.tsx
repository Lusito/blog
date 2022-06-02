import { ArticleHead } from "../components/ArticleHead/ArticleHead";
import { Container } from "../components/Container/Container";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { siteUrl } from "./config";
import { PageInfo } from "./pageUtils";

type ListAllPageProps = {
    pages: PageInfo[];
};

export async function ListAllPage({ pages }: ListAllPageProps) {
    const title = "All Posts";
    return (
        <DefaultLayout pageTitle={title}>
            <main>
                <ArticleHead title={title} image="default.jpg" />
                <Container>
                    <ul>
                        {pages.map((page) => (
                            <li>
                                <a href={`${siteUrl}/${page.slug}.html`}>{page.title}</a> ({page.date.toUTCString()})
                            </li>
                        ))}
                    </ul>
                </Container>
            </main>
        </DefaultLayout>
    );
}
