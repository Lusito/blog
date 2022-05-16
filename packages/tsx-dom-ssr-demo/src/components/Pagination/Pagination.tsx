import { Css } from '../Css';
import classes from './Pagination.module.css';

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  url: (page: number) => string;
};

export const Pagination = ({
  currentPage,
  totalPages,
  url,
}: PaginationProps) => (
  <ul class={classes.pagination}>
    <Css style={classes} />
    <li>
      <a href={currentPage > 1 ? url(currentPage - 1) : undefined}>Prev</a>
    </li>
    {Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return (
        <li>{page === currentPage ? page : <a href={url(page)}>{page}</a>}</li>
      );
    })}
    <li>
      <a href={currentPage < totalPages ? url(currentPage + 1) : undefined}>
        Next
      </a>
    </li>
  </ul>
);
