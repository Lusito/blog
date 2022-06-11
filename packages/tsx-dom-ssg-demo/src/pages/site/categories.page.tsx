import { ArticleHead } from "../../components/ArticleHead/ArticleHead";
import { Container } from "../../components/Container/Container";
import { MetaTags } from "../../components/MetaTags/MetaTags";
import { TagDetail } from "../../components/TagDetail/TagDetail";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import { FrontMatter, tagLabels, tagSlugToLabel } from "../../utils/pageUtils";

export const frontMatter: FrontMatter = {
    tags: [],
    title: "All Categories",
    description: "An overview over all categories on this blog",
    date: "2022-06-01T10:44:12.865Z",
    slug: "categories",
};

// eslint-disable-next-line func-names
export default async function () {
    return (
        <DefaultLayout pageTitle={frontMatter.title}>
            <main>
                <MetaTags
                    description={frontMatter.description}
                    slug={frontMatter.slug!}
                    title={frontMatter.title}
                    tags={tagLabels}
                />
                <ArticleHead title={frontMatter.title} description={frontMatter.description} />
                <Container>
                    {tagLabels.map((tag) => (
                        <TagDetail tag={tag} />
                    ))}
                </Container>
            </main>
        </DefaultLayout>
    );
}
