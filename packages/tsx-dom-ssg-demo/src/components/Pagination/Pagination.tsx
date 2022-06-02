import { siteUrl } from "../../utils/config";
import { withCss } from "../../utils/withCss";
import classes from "./Pagination.module.scss";

type LinkProps = {
    path: string;
    label: string | number;
    page: number;
    disabled: boolean;
};
const Link = ({ path, label, page, disabled }: LinkProps) => {
    if (disabled) return <span>{label}</span>;

    let href: string;
    if (page === 1) {
        href = path === "/latest" ? `${siteUrl}/` : `${siteUrl}${path}.html`;
    } else {
        href = `${siteUrl}${path}/${page}.html`;
    }
    return <a href={href}>{label}</a>;
};

type PaginationProps = {
    path: string;
    numPages: number;
    activePage: number;
};

export const Pagination = withCss(classes, ({ path, numPages, activePage }: PaginationProps) => {
    if (numPages <= 1) return null;

    return (
        <div class={classes.pagination}>
            <Link path={path} label="Prev" page={activePage - 1} disabled={activePage === 1} />
            {Array.from({ length: numPages }, (_, pageIndex) => {
                const pageNumber = pageIndex + 1;
                return <Link path={path} label={pageNumber} page={pageNumber} disabled={activePage === pageNumber} />;
            })}
            <Link path={path} label="Next" page={activePage + 1} disabled={activePage === numPages} />
        </div>
    );
});