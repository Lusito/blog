import { BackLink } from '../components/BackLink/BackLink';
import { Episode } from '../components/Episode/Episode';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { RamCharacter, RamEpisode } from '../types/ramTypes';
import { fetchJson, fetchRAM } from '../utils/fetchUtils';

export type EpisodePageProps = {
  id: string;
};

export async function EpisodePage({ id }: EpisodePageProps) {
  const episode = await fetchRAM<RamEpisode>(`/episode/${id}`);
  const characters = await Promise.all(
    episode.characters.map((character) => fetchJson<RamCharacter>(character))
  );

  return (
    <DefaultLayout>
      <head>
        <title>Episode: {episode.name}</title>
      </head>
      <BackLink url="/episodes" label="All Episodes" />
      <Episode episode={episode} />
      <ul>
        {characters.map((character) => (
          <li><a href={`/character/${character.id}`}>{character.name}</a></li>
        ))}
      </ul>
    </DefaultLayout>
  );
}
