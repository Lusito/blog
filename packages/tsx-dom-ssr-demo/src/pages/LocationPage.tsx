import { BackLink } from "../components/BackLink/BackLink";
import { Location } from "../components/Location/Location";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { RamLocation } from "../types/ramTypes";
import { fetchRAM } from "../utils/fetchUtils";

export type LocationPageProps = {
    id: string;
};

export async function LocationPage({ id }: LocationPageProps) {
    const location = await fetchRAM<RamLocation>(`/location/${id}`);

    return (
        <DefaultLayout title={`Location: ${location.name}`}>
            <BackLink url="/locations" label="All Locations" />
            <Location location={location} />
        </DefaultLayout>
    );
}
