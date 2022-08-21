import { ArticleHeader } from "../../components/ArticleHeader/ArticleHeader";
import { Container } from "../../components/Container/Container";
import { MetaTags } from "../../components/MetaTags/MetaTags";
import { TagList } from "../../components/TagList/TagList";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import { FrontMatter, tagLabels } from "../../utils/pageUtils";

export const frontMatter: FrontMatter = {
    tags: [],
    title: "404",
    description: "File Not Found",
    created: "2022-06-01",
};

// eslint-disable-next-line func-names
export default function () {
    return (
        <DefaultLayout pageTitle={frontMatter.title}>
            <article>
                <MetaTags
                    description={frontMatter.description}
                    slug={frontMatter.slug!}
                    title={frontMatter.title}
                    tags={[]}
                />
                <ArticleHeader title={frontMatter.title} subTitle={frontMatter.description} />
                <Container>
                    <p>Could not find the file you were looking for! Try looking at one of these topics:</p>
                    <TagList tags={tagLabels} />
                </Container>
            </article>
        </DefaultLayout>
    );
}
