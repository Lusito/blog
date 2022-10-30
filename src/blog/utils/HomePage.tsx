import { ArticleHeader } from "../components/ArticleHeader/ArticleHeader";
import { Box } from "../components/Box/Box";
import { Container } from "../components/Container/Container";
import { LinkButton } from "../components/LinkButton/LinkButton";
import { MetaTags } from "../components/MetaTags/MetaTags";
import { Synopsis } from "../components/Synopsis/Synopsis";
import { TagList } from "../components/TagList/TagList";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { siteDescription, siteTitle } from "./config";
import { PageInfo, tagLabels } from "./pageUtils";
import classes from "./HomePage.module.scss";
import { withCss } from "./withCss";

export const itemsPerPage = 10;

type HomePageProps = {
    pages: PageInfo[];
};

const description = `${siteDescription} Feel free to leave comments on blog-posts via GitHub`;

export const HomePage = withCss(classes, ({ pages }: HomePageProps) => (
    <DefaultLayout>
        <article class={classes.homepage}>
            <MetaTags description={description} slug="" title={siteTitle} tags={tagLabels} />
            <ArticleHeader title={siteTitle} />
            <Container>
                <Synopsis>{description}</Synopsis>
                <h2 class={classes.heading}>Latest Post</h2>
                {pages.slice(0, 1).map((page) => (
                    <Box href={`/${page.slug}.html`} title={page.title} date={page.created}>
                        <div>{page.description}</div>
                        <TagList tags={page.tags} />
                    </Box>
                ))}
                <div class={classes.bottomLinks}>
                    <LinkButton href="/latest.html" class={classes.linkButtonFullWidth}>
                        Show More Posts
                    </LinkButton>
                    <LinkButton href="/categories.html" class={classes.linkButtonFullWidth}>
                        Show All Categories
                    </LinkButton>
                </div>
            </Container>
        </article>
    </DefaultLayout>
));
