import { Article } from "../../components/Article/Article";
import { ArticleHead } from "../../components/ArticleHead/ArticleHead";
import { Container } from "../../components/Container/Container";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import type { FrontMatter } from "../../utils/getPages";

export const frontMatter: FrontMatter = {
    tags: ["react", "typescript"],
    title: "Routing in React",
    image: "couple1.jpg",
    description: "You know when you're doing stuff...",
    date: "2022-06-01T10:44:12.865Z",
    slug: "routing-in-react",
};

// eslint-disable-next-line func-names
export default async function () {
    return (
        <DefaultLayout pageTitle={frontMatter.title}>
            <main>
                <ArticleHead title={frontMatter.title} image={frontMatter.image} />
                <Container>
                    <Article>Whooo</Article>
                    <div>Tags: {frontMatter.tags.join(",")}</div>
                    <div>giscus</div>
                </Container>
            </main>
        </DefaultLayout>
    );
}
