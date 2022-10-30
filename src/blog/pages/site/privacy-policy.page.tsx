import fs from "fs";

import { MarkdownArticleBody } from "../../components/ArticleBody/ArticleBody";
import { ArticleHeader } from "../../components/ArticleHeader/ArticleHeader";
import { Container } from "../../components/Container/Container";
import { MetaTags } from "../../components/MetaTags/MetaTags";
import { Synopsis } from "../../components/Synopsis/Synopsis";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import { FrontMatter, tagLabels } from "../../utils/pageUtils";

export const frontMatter: FrontMatter = {
    tags: [],
    title: "Privacy Policy",
    description:
        "In short: I don't collect any data. Only necessary cookies will be set (for example when you login for commenting).",
    created: "2022-08-29",
};

export default async function PrivacyPolicyPage() {
    const markdownDe = await fs.promises.readFile(`${__dirname}/privacy-policy-de.md`);
    const markdownEn = await fs.promises.readFile(`${__dirname}/privacy-policy-en.md`);

    return (
        <DefaultLayout pageTitle={frontMatter.title}>
            <article>
                <MetaTags
                    description={frontMatter.description}
                    slug={frontMatter.slug!}
                    title={frontMatter.title}
                    tags={tagLabels}
                />
                <ArticleHeader title={frontMatter.title} subTitle="German: Datenschutzerklärung" />
                <Container>
                    <Synopsis>
                        {frontMatter.description} Details available in{" "}
                        <a href="./privacy-policy.html#english">English</a> and{" "}
                        <a href="./privacy-policy.html#german">German</a>
                    </Synopsis>
                    <a name="english"></a>
                    <MarkdownArticleBody markdown={markdownEn.toString()} />
                    <a name="german"></a>
                    <MarkdownArticleBody markdown={markdownDe.toString()} />
                </Container>
            </article>
        </DefaultLayout>
    );
}
