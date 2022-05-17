import { Location } from "../components/Location/Location";
import { Pagination } from "../components/Pagination/Pagination";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { RamLocation, RamPage } from "../types/ramTypes";
import { fetchRAM } from "../utils/fetchUtils";

type LocationsPageProps = {
    currentPage: number;
};

export async function LocationsPage({ currentPage }: LocationsPageProps) {
    const page = await fetchRAM<RamPage<RamLocation>>(`/location?page=${currentPage}`);

    return (
        <DefaultLayout>
            <head>
                <title>Locations</title>
            </head>
            <div>
                {page.results.map((location) => (
                    <Location location={location} />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={page.info.pages}
                url={(pageNum) => `/locations?page=${pageNum}`}
            />
        </DefaultLayout>
    );
}
