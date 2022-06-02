import { ArticleHead } from "../components/ArticleHead/ArticleHead";
import { Container } from "../components/Container/Container";
import { PagePreview } from "../components/PagePreview/PagePreview";
import { Pagination } from "../components/Pagination/Pagination";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { PageInfo } from "./getPages";

export const itemsPerPage = 10;

type ListPageProps = {
    path: string;
    title: string;
    pages: PageInfo[];
    pageNumber: number;
};

export async function ListPage({ path, title, pages, pageNumber }: ListPageProps) {
    const pageIndex = pageNumber - 1;
    const start = pageIndex * itemsPerPage;
    const filtered = pages.slice(start, start + itemsPerPage);

    // fixme: show a short description on the tag page.. for example: "Toilet Papers are ..."
    // fixme: could have a sidebar with all available tags

    const pagination = <Pagination path={path} numPages={pages.length / itemsPerPage} activePage={pageNumber} />;

    return (
        <DefaultLayout pageTitle={title}>
            <main>
                <ArticleHead title={title} image="default.jpg" />
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
