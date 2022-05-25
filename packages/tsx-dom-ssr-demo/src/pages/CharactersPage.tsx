import { Character } from "../components/Character/Character";
import { Css } from "../components/Css";
import { Pagination } from "../components/Pagination/Pagination";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { PaginationLayout } from "../layouts/PaginationLayout";
import { RamCharacter, RamPage } from "../types/ramTypes";
import { fetchRAM } from "../utils/fetchUtils";
import classes from "./CharactersPage.module.css";

type CharactersPageProps = {
    currentPage: number;
};

export async function CharactersPage({ currentPage }: CharactersPageProps) {
    const page = await fetchRAM<RamPage<RamCharacter>>(`/character?page=${currentPage}`);

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
