import { Location } from "../components/Location/Location";
import { Pagination } from "../components/Pagination/Pagination";
import { PaginationLayout } from "../layouts/PaginationLayout";
import { RamLocation, RamPage } from "../types/ramTypes";
import { fetchRAM } from "../utils/fetchUtils";

type LocationsPageProps = {
    currentPage: number;
};

export async function LocationsPage({ currentPage }: LocationsPageProps) {
    const page = await fetchRAM<RamPage<RamLocation>>(`/location?page=${currentPage}`);
    const pagination = (
        <Pagination
            currentPage={currentPage}
            totalPages={page.info.pages}
            url={(pageNum) => `/locations?page=${pageNum}`}
        />
    );

    return (
        <PaginationLayout title="Locations" pagination={pagination}>
            <div>
                {page.results.map((location) => (
                    <Location location={location} />
                ))}
            </div>
        </PaginationLayout>
    );
}
