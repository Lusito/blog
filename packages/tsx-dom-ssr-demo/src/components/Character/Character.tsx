import { RamCharacter, RamNameAndUrl } from "../../types/ramTypes";
import { Css } from "../Css";
import { InfoRow, InfoTable } from "../InfoTable/InfoTable";
import classes from "./Character.module.scss";

const genderSymbols = {
    Female: "♀",
    Male: "♂",
    Genderless: "⚲",
    unknown: undefined,
};

const LocationLink = ({ url, name }: RamNameAndUrl) => {
    if (!url) return name;
    return <a href={`/location/${url.split("/").pop()}`}>{name}</a>;
};

export type CharacterProps = {
    character: RamCharacter;
};

export function Character({ character }: CharacterProps) {
    return (
        <div class={classes.character}>
            <Css style={classes} />
            <a href={`/character/${character.id}`} class={classes.characterImageWrapper}>
                <img src={character.image} alt="Profile Picture" class={classes.characterImage} />
            </a>
            <div>
                <InfoTable>
                    <InfoRow label="Name">
                        <a href={`/character/${character.id}`}>
                            {genderSymbols[character.gender] ?? "?"} {character.name}
                        </a>
                    </InfoRow>
                    <InfoRow label="Status">{character.status}</InfoRow>
                    <InfoRow label="Species">{character.species}</InfoRow>
                    {character.type && <InfoRow label="Type">{character.type}</InfoRow>}
                    <InfoRow label="Origin">
                        <LocationLink url={character.origin.url} name={character.origin.name} />
                    </InfoRow>
                    <InfoRow label="Location">
                        <LocationLink url={character.location.url} name={character.location.name} />
                    </InfoRow>
                </InfoTable>
            </div>
        </div>
    );
}
