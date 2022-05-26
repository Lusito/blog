import { Character } from "../components/Character/Character";
import { Css } from "../components/Css";
import { Pagination } from "../components/Pagination/Pagination";
import { PaginationLayout } from "../layouts/PaginationLayout";
import { RamCharacter } from "../types/ramTypes";
import { fetchRAMPage } from "../utils/fetchUtils";
import classes from "./CharactersPage.module.scss";

type CharactersPageProps = {
    currentPage: number;
};

export async function CharactersPage({ currentPage }: CharactersPageProps) {
    const page = await fetchRAMPage<RamCharacter>("/character", currentPage);

    const pagination = (
        <Pagination
            currentPage={currentPage}
            totalPages={page.info.pages}
            url={(pageNum) => `/characters?page=${pageNum}`}
        />
    );

    return (
        <PaginationLayout title="Characters" pagination={pagination}>
            <Css style={classes} />
            <div class={classes.charactersPageList}>
                {page.results.map((character) => (
                    <Character character={character} />
                ))}
            </div>
        </PaginationLayout>
    );
}
