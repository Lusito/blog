import { ArticleHeader } from "../components/ArticleHeader/ArticleHeader";
import { Box } from "../components/Box/Box";
import { Container } from "../components/Container/Container";
import { MetaTags } from "../components/MetaTags/MetaTags";
import { TagList } from "../components/TagList/TagList";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { PageInfo, tagLabels } from "./pageUtils";
import classes from "./SearchPage.module.scss";
import { withCss } from "./withCss";

type SearchPageProps = {
    pages: PageInfo[];
};

const title = "Search";
const description = "Search this blog";

export const SearchPage = withCss(classes, ({ pages }: SearchPageProps) => (
    <DefaultLayout pageTitle={title}>
        <article>
            <MetaTags description={description} slug="all" title={title} tags={tagLabels} />
            <ArticleHeader title={title} subTitle={description} />
            <Container>
                <search-container searchField={classes.searchField} searchItem={classes.searchItem}>
                    <label class={classes.searchFieldWrapper}>
                        <span>Search: </span>
                        <input type="search" autofocus class={classes.searchField} />
                    </label>
                    {pages.map((page) => (
                        <div class={classes.searchItem}>
                            <Box href={`/${page.slug}.html`} title={page.title} date={page.created}>
                                <div>{page.description}</div>
                                <TagList tags={page.tags} />
                            </Box>
                        </div>
                    ))}
                </search-container>
            </Container>
        </article>
    </DefaultLayout>
));
