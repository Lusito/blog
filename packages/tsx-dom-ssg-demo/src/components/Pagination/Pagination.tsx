import { withCss } from "../../utils/withCss";
import { LinkButton } from "../LinkButton/LinkButton";
import classes from "./Pagination.module.scss";

type LinkProps = {
    path: string;
    label: string | number;
    page: number;
    disabled: boolean;
};
const Link = ({ path, label, page, disabled }: LinkProps) => {
    if (disabled) return <LinkButton label={label} />;

    let href: string;
    if (page === 1) {
        href = path === "/latest" ? "/" : `${path}.html`;
    } else {
        href = `${path}/${page}.html`;
    }
    return <LinkButton href={href} label={label} />;
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
