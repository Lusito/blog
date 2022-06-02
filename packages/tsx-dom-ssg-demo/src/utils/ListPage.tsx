import { ArticleHead } from "../components/ArticleHead/ArticleHead";
import { Container } from "../components/Container/Container";
import { PagePreview } from "../components/PagePreview/PagePreview";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { PageInfo, tagLabels } from "./getPages";

type ListPageProps = {
    tag?: string;
    pages: PageInfo[];
    start: number;
    end?: number;
};

export async function ListPage({ tag, pages, start, end }: ListPageProps) {
    const tagLabel = tag && (tagLabels[tag] ?? tag);
    const filtered = (
        tagLabel
            ? // Filter by tag label
              pages.filter((p) => p.tags.includes(tagLabel))
              // Pages without tags are internal (for example "about") and not supposed to be listed
            : pages.filter((p) => p.tags.length > 0)
    ).slice(start, end);
    const title = tagLabel ?? "Latest Posts";

    // fixme: show a short description on the tag page.. for example: "Toilet Papers are ..."
    return (
        <DefaultLayout pageTitle={title}>
            <main>
                <ArticleHead title={title} image="default.jpg" />
                <Container>
                    {filtered.map((page) => (
                        <PagePreview page={page} />
                    ))}
                </Container>
            </main>
        </DefaultLayout>
    );
}