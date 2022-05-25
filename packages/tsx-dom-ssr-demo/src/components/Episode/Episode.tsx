import { RamEpisode } from "../../types/ramTypes";

export type EpisodeProps = {
    episode: RamEpisode;
};

export const Episode = ({ episode }: EpisodeProps) => (
    <div>
        {episode.episode}: <a href={`/episode/${episode.id}`}>{episode.name}</a> (Aired {episode.air_date})
    </div>
);
