import { ArticleHead } from "../components/ArticleHead/ArticleHead";
import { Container } from "../components/Container/Container";
import { MetaTags } from "../components/MetaTags/MetaTags";
import { PagePreview } from "../components/PagePreview/PagePreview";
import { Pagination } from "../components/Pagination/Pagination";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { PageInfo } from "./pageUtils";

export const itemsPerPage = 10;

type ListPageProps = {
    path: string;
    tags: string[];
    title: string;
    description: string;
    pages: PageInfo[];
    pageNumber: number;
};

export async function ListPage({ path, tags, title, description, pages, pageNumber }: ListPageProps) {
    const pageIndex = pageNumber - 1;
    const start = pageIndex * itemsPerPage;
    const filtered = pages.slice(start, start + itemsPerPage);

    const pagination = (
        <Pagination path={path} numPages={Math.ceil(pages.length / itemsPerPage)} activePage={pageNumber} />
    );

    return (
        <DefaultLayout pageTitle={title}>
            <main>
                <MetaTags description={description} slug={path.slice(1)} title={title} tags={tags} />
                <ArticleHead title={title} description={description} />
                <Container>
                    {pagination}
                    {filtered.map((page) => (
                        <PagePreview page={page} />
                    ))}
                    {pagination}
                </Container>
            </main>
        </DefaultLayout>
    );
}
