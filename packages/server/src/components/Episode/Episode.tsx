import { RamEpisode } from '../../types/ramTypes';

export type EpisodeProps = {
  episode: RamEpisode;
};

export const Episode = ({ episode }: EpisodeProps) => {
  return (
    <div>
      {episode.episode}: <a href={`/episode/${episode.id}`}>{episode.name}</a>
    </div>
  );
};