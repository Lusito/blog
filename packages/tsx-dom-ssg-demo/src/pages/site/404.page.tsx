import { ArticleHead } from "../../components/ArticleHead/ArticleHead";
import { Container } from "../../components/Container/Container";
import { MetaTags } from "../../components/MetaTags/MetaTags";
import { TagList } from "../../components/TagList/TagList";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import { FrontMatter, tagLabels } from "../../utils/pageUtils";

export const frontMatter: FrontMatter = {
    tags: [],
    title: "404",
    description: "File Not Found",
    date: "2022-06-01T10:44:12.865Z",
    slug: "404",
};

// eslint-disable-next-line func-names
export default async function () {
    return (
        <DefaultLayout pageTitle={frontMatter.title}>
            <main>
                <MetaTags description={frontMatter.description} slug={frontMatter.slug!} title={frontMatter.title} />
                <ArticleHead title={frontMatter.title} description={frontMatter.description} />
                <Container>
                    <p>Could not find the file you were looking for! Try looking at one of these topics:</p>
                    <TagList tags={Object.values(tagLabels).sort()} />
                </Container>
            </main>
        </DefaultLayout>
    );
}
