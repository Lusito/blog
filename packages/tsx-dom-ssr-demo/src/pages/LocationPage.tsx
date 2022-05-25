import { BackLink } from "../components/BackLink/BackLink";
import { Location } from "../components/Location/Location";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { RamCharacter, RamLocation } from "../types/ramTypes";
import { fetchRAM } from "../utils/fetchUtils";

export type LocationPageProps = {
    id: string;
};

export async function LocationPage({ id }: LocationPageProps) {
    const location = await fetchRAM<RamLocation>(`/location/${id}`);
    const residentIds = location.residents.map((resident) => resident.split("/").pop());
    const residents = await fetchRAM<RamCharacter[]>(`/character/${residentIds}`);

    return (
        <DefaultLayout title={`Location: ${location.name}`}>
            <BackLink url="/locations" label="All Locations" />
            <Location location={location} />

            <h2>Residents:</h2>
            <ul>
                {residents.map((resident) => (
                    <li>
                        <a href={`/character/${resident.id}`}>{resident.name}</a>
                    </li>
                ))}
            </ul>
        </DefaultLayout>
    );
}
