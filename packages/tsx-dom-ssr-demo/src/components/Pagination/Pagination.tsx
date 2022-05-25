import { Css } from "../Css";
import classes from "./Pagination.module.css";

export type PaginationProps = {
    currentPage: number;
    totalPages: number;
    url: (page: number | string) => string;
};

export const Pagination = ({ currentPage, totalPages, url }: PaginationProps) => (
    <ul class={classes.pagination}>
        <Css style={classes} />
        <li>
            <a href={currentPage > 1 ? url(currentPage - 1) : undefined}>Prev</a>
        </li>
        <li>
            <page-picker url={url("{{PAGE}}")} tsxTag="select" autocomplete="off">
                {Array.from({ length: totalPages }, (_, index) => (
                    <option value={index + 1} selected={index + 1 === currentPage}>
                        {index + 1}
                    </option>
                ))}
            </page-picker>
        </li>
        <li>
            <a href={currentPage < totalPages ? url(currentPage + 1) : undefined}>Next</a>
        </li>
    </ul>
);
