import { withCss } from "../../utils/withCss";
import { LinkButton } from "../LinkButton/LinkButton";
import classes from "./Pagination.module.scss";

type LinkProps = {
    path: string;
    label: string | number;
    ariaLabel?: string;
    ariaCurrent?: "page";
    page: number;
    disabled: boolean;
};
const Link = ({ path, label, ariaLabel, ariaCurrent, page, disabled }: LinkProps) => {
    let href: string | undefined;
    if (!disabled) {
        if (page === 1) {
            href = path === "/latest" ? "/" : `${path}.html`;
        } else {
            href = `${path}/${page}.html`;
        }
    }

    return (
        <LinkButton href={href} ariaLabel={ariaLabel} ariaCurrent={ariaCurrent} theme="pagination">
            {label}
        </LinkButton>
    );
};

type PaginationProps = {
    path: string;
    numPages: number;
    activePage: number;
};

export const Pagination = withCss(classes, ({ path, numPages, activePage }: PaginationProps) => {
    if (numPages <= 1) return null;

    return (
        <nav role="navigation" class={classes.pagination} aria-label="Pagination Navigation">
            <Link
                path={path}
                label="Prev"
                ariaLabel="Go to previous page"
                page={activePage - 1}
                disabled={activePage === 1}
            />
            {Array.from({ length: numPages }, (_, pageIndex) => {
                const pageNumber = pageIndex + 1;
                const isCurrent = activePage === pageNumber;
                return (
                    <Link
                        path={path}
                        label={pageNumber}
                        ariaLabel={isCurrent ? `Current page, page ${pageNumber}` : `Go to page ${pageNumber}`}
                        ariaCurrent={isCurrent ? "page" : undefined}
                        page={pageNumber}
                        disabled={isCurrent}
                    />
                );
            })}
            <Link
                path={path}
                label="Next"
                ariaLabel="Go to next page"
                page={activePage + 1}
                disabled={activePage === numPages}
            />
        </nav>
    );
});
