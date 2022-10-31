import { ArticleBody } from "../../components/ArticleBody/ArticleBody";
import { ArticleHeader } from "../../components/ArticleHeader/ArticleHeader";
import { Container } from "../../components/Container/Container";
import { MarkdownContent } from "../../components/MarkdownContent/MarkdownContent";
import { MetaTags } from "../../components/MetaTags/MetaTags";
import { Synopsis } from "../../components/Synopsis/Synopsis";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import { FrontMatter, tagLabels } from "../../utils/pageUtils";
import policyEn from "./privacy-policy-en.md";
import policyDe from "./privacy-policy-de.md";

export const frontMatter: FrontMatter = {
    tags: [],
    title: "Privacy Policy",
    description:
        "In short: I don't collect any data. Only necessary cookies will be set (for example when you login for commenting).",
    created: "2022-08-29",
};

export default function PrivacyPolicyPage() {
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
                    <MarkdownContent html={policyEn.html} />
                    <a name="german"></a>
                    <MarkdownContent html={policyDe.html} />
                </Container>
            </article>
        </DefaultLayout>
    );
}
