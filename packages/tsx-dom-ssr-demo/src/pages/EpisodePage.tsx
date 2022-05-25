import { BackLink } from "../components/BackLink/BackLink";
import { Episode } from "../components/Episode/Episode";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { RamCharacter, RamEpisode } from "../types/ramTypes";
import { fetchRAM } from "../utils/fetchUtils";

export type EpisodePageProps = {
    id: string;
};

export async function EpisodePage({ id }: EpisodePageProps) {
    const episode = await fetchRAM<RamEpisode>(`/episode/${id}`);
    const characterIds = episode.characters.map((character) => character.split("/").pop());
    const characters = await fetchRAM<RamCharacter[]>(`/character/${characterIds}`);

    return (
        <DefaultLayout title={`Episode: ${episode.name}`}>
            <BackLink url="/episodes" label="All Episodes" />
            <Episode episode={episode} />

            <h2>Characters:</h2>
            <ul>
                {characters.map((character) => (
                    <li>
                        <a href={`/character/${character.id}`}>{character.name}</a>
                    </li>
                ))}
            </ul>
        </DefaultLayout>
    );
}
