import { BaseProps } from "tsx-dom-ssr";

import { ArticleHeader } from "../../components/ArticleHeader/ArticleHeader";
import { Container } from "../../components/Container/Container";
import { MetaTags } from "../../components/MetaTags/MetaTags";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import { FrontMatter, tagLabels } from "../../utils/pageUtils";

export const frontMatter: FrontMatter = {
    tags: [],
    title: "Legal Notice",
    description: "Legal information required in my country.",
    created: "2022-08-29",
};

type RowProps = {
    label: string;
};

const Row = ({ label, children }: BaseProps & RowProps) => (
    <tr>
        <td>{label}</td>
        <td>{children}</td>
    </tr>
);

const encodeText = (text: string) =>
    text
        .split("")
        .map((c) => `&#${c.charCodeAt(0)};`)
        .join("");
const Encoded = ({ text }: { text: string }) => <span dangerouslySetInnerHTML={encodeText(text)} />;

// eslint-disable-next-line func-names
export default function () {
    return (
        <DefaultLayout pageTitle={frontMatter.title}>
            <article>
                <MetaTags
                    description={frontMatter.description}
                    slug={frontMatter.slug!}
                    title={frontMatter.title}
                    tags={tagLabels}
                />
                <ArticleHeader title={frontMatter.title} subTitle="German: Impressum" />
                <Container>
                    <p>Responsible person for the content / Verantwortlich für den Inhalt nach § 55 Abs. 2</p>
                    <table>
                        <Row label="Name">Santo Pfingsten</Row>
                        <Row label="Address / Addresse">
                            <Encoded text="Elsbethstr. 36" />
                            <br />
                            <Encoded text="04155 Leipzig (Germany)" />
                        </Row>
                        <Row label="Phone / Telefon">
                            <Encoded text="(+49)176-11111089" />
                        </Row>
                        <Row label="E-Mail">
                            <Encoded text="santo [ät] lusito.info" />
                        </Row>
                    </table>
                </Container>
            </article>
        </DefaultLayout>
    );
}
