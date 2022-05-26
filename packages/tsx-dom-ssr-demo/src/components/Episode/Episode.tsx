import { RamEpisode } from "../../types/ramTypes";
import { Css } from "../Css";
import classes from "./Episode.module.scss";

export type EpisodeProps = {
    episode: RamEpisode;
};

export const Episode = ({ episode }: EpisodeProps) => (
    <div class={classes.episode}>
        <Css style={classes} />
        {episode.episode}: <a href={`/episode/${episode.id}`}>{episode.name}</a> (Aired {episode.air_date})
    </div>
);
