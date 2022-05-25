import { Character } from "../components/Character/Character";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { RamCharacter, RamEpisode } from "../types/ramTypes";
import { fetchRAM } from "../utils/fetchUtils";

export type CharacterPageProps = {
    id: string;
};

export async function CharacterPage({ id }: CharacterPageProps) {
    const character = await fetchRAM<RamCharacter>(`/character/${id}`);
    const episodeIds = character.episode.map((episode) => episode.split("/").pop());
    let episodes = await fetchRAM<RamEpisode | RamEpisode[]>(`/episode/${episodeIds}`);
    if (!Array.isArray(episodes)) episodes = [episodes];

    return (
        <DefaultLayout title={`Character: ${character.name}`}>
            <Character character={character} />

            <h2>Episodes:</h2>
            <ul>
                {episodes.map((episode) => (
                    <li>
                        <a href={`/episode/${episode.id}`}>{episode.name}</a>
                    </li>
                ))}
            </ul>
        </DefaultLayout>
    );
}
