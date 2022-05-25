import { RamLocation } from "../../types/ramTypes";

export type LocationProps = {
    location: RamLocation;
};

export const Location = ({ location }: LocationProps) => {
    const name = location.name.replace(`(${location.dimension.replace(/^Dimension /, "")})`, "").trim();

    return (
        <div>
            <a href={`/location/${location.id}`}>{name}</a>
            , {location.type} of {location.dimension}
        </div>
    );
};
