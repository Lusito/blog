import slugify from "slug";

import { ArticleHeader } from "../../components/ArticleHeader/ArticleHeader";
import { Box } from "../../components/Box/Box";
import { Container } from "../../components/Container/Container";
import { MetaTags } from "../../components/MetaTags/MetaTags";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import { FrontMatter, tagLabels } from "../../utils/pageUtils";
import { tagDescriptions } from "../../utils/tagDescriptions";

export const frontMatter: FrontMatter = {
    tags: [],
    title: "All Categories",
    description: "An overview over all categories on this blog",
    created: "2022-06-01",
    modified: new Date().toISOString().split("T")[0],
    slug: "categories",
};

// eslint-disable-next-line func-names
export default async function () {
    return (
        <DefaultLayout pageTitle={frontMatter.title}>
            <article>
                <MetaTags
                    description={frontMatter.description}
                    slug={frontMatter.slug!}
                    title={frontMatter.title}
                    tags={tagLabels}
                />
                <ArticleHeader title={frontMatter.title} subTitle={frontMatter.description} />
                <Container>
                    {tagLabels.map((tag) => (
                        <Box href={`/tag/${slugify(tag)}.html`} title={tag}>
                            <div>{tagDescriptions[tag]}</div>
                        </Box>
                    ))}
                </Container>
            </article>
        </DefaultLayout>
    );
}
