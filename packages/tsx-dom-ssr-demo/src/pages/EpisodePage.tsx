import { ComponentThis } from "tsx-dom-ssr";

import { Episode } from "../components/Episode/Episode";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { RamCharacter, RamEpisode } from "../types/ramTypes";
import { fetchRAM } from "../utils/fetchUtils";

export type EpisodePageProps = {
    id: string;
};

export async function EpisodePage(this: ComponentThis, { id }: EpisodePageProps) {
    const episode = await fetchRAM<RamEpisode>(`/episode/${id}`, { signal: this.abortSignal });
    const characterIds = episode.characters.map((character) => character.split("/").pop());
    let characters = await fetchRAM<RamCharacter | RamCharacter[]>(`/character/${characterIds}`, {
        signal: this.abortSignal,
    });
    if (!Array.isArray(characters)) characters = [characters];

    return (
        <DefaultLayout title={`Episode: ${episode.name}`}>
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
