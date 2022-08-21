import { ArticleHeader } from "../components/ArticleHeader/ArticleHeader";
import { Box } from "../components/Box/Box";
import { Container } from "../components/Container/Container";
import { MetaTags } from "../components/MetaTags/MetaTags";
import { Pagination } from "../components/Pagination/Pagination";
import { TagList } from "../components/TagList/TagList";
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

export const ListPage = ({ path, tags, title, description, pages, pageNumber }: ListPageProps) => {
    const pageIndex = pageNumber - 1;
    const start = pageIndex * itemsPerPage;
    const filtered = pages.slice(start, start + itemsPerPage);

    const pagination = (
        <Pagination path={path} numPages={Math.ceil(pages.length / itemsPerPage)} activePage={pageNumber} />
    );

    return (
        <DefaultLayout pageTitle={title}>
            <article>
                <MetaTags description={description} slug={path.slice(1)} title={title} tags={tags} />
                <ArticleHeader title={title} subTitle={description} />
                <Container>
                    {pagination}
                    {filtered.map((page) => (
                        <Box href={`/${page.slug}.html`} title={page.title} date={page.created}>
                            <div>{page.description}</div>
                            <TagList tags={page.tags} />
                        </Box>
                    ))}
                    {pagination}
                </Container>
            </article>
        </DefaultLayout>
    );
};
