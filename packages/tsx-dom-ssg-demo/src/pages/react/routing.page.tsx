import { Article } from "../../components/Article/Article";
import { Container } from "../../components/Container/Container";
import { DefaultLayout } from "../../layouts/DefaultLayout";

export const tags = ["react", "typescript"];
export const title = "Routing in React";
export const description = "You know when you're doing stuff...";
export const timestamp = 1653913013221; // fixme: maybe rather iso formatted?
export const slug = "routing-in-react"; // optional, usually generated from title

// eslint-disable-next-line func-names
export default async function () {
    return (
        <DefaultLayout pageTitle={title}>
            <main>
                <Container>
                    <Article title="Some Article">Whooo</Article>
                    <div>Tags: {tags.join(",")}</div>
                    <div>giscus</div>
                </Container>
            </main>
        </DefaultLayout>
    );
}
