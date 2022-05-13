import { BackLink } from '../components/BackLink/BackLink';
import { Episode } from '../components/Episode/Episode';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { RamEpisode } from '../types/ramTypes';
import { fetchRAM } from '../utils/fetchUtils';

export type EpisodePageProps = {
  id: string;
};

export async function EpisodePage({ id }: EpisodePageProps) {
  const episode = await fetchRAM<RamEpisode>(`/episode/${id}`);

  return (
    <DefaultLayout>
      <head>
        <title>Episode: {episode.name}</title>
      </head>
      <BackLink url="/episodes" label="All Episodes" />
      <Episode episode={episode} />
    </DefaultLayout>
  );
}
