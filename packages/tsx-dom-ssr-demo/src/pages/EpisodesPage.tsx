import { Episode } from "../components/Episode/Episode";
import { Pagination } from "../components/Pagination/Pagination";
import { PaginationLayout } from "../layouts/PaginationLayout";
import { RamEpisode, RamPage } from "../types/ramTypes";
import { fetchRAM } from "../utils/fetchUtils";

type EpisodesPageProps = {
    currentPage: number;
};

export async function EpisodesPage({ currentPage }: EpisodesPageProps) {
    const page = await fetchRAM<RamPage<RamEpisode>>(`/episode?page=${currentPage}`);
    const pagination = (
        <Pagination
            currentPage={currentPage}
            totalPages={page.info.pages}
            url={(pageNum) => `/episodes?page=${pageNum}`}
        />
    );

    return (
        <PaginationLayout title="Episodes" pagination={pagination}>
            <div>
                {page.results.map((episode) => (
                    <Episode episode={episode} />
                ))}
            </div>
        </PaginationLayout>
    );
}
