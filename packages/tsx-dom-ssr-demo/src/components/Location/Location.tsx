import { RamLocation } from "../../types/ramTypes";
import { Css } from "../Css";
import classes from "./Location.module.scss";

export type LocationProps = {
    location: RamLocation;
};

export const Location = ({ location }: LocationProps) => {
    const name = location.name.replace(`(${location.dimension.replace(/^Dimension /, "")})`, "").trim();

    return (
        <div class={classes.location}>
            <Css style={classes} />
            <a href={`/location/${location.id}`}>{name}</a>, {location.type} of {location.dimension}
        </div>
    );
};
