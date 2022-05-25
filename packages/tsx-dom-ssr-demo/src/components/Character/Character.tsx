import { RamCharacter } from "../../types/ramTypes";
import { Css } from "../Css";
import { InfoRow, InfoTable } from "../InfoTable/InfoTable";
import classes from "./Character.module.scss";

const genderSymbols = {
    Female: "♀",
    Male: "♂",
    Genderless: "⚲",
    unknown: undefined,
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
                        <a href={`/location/${character.origin.url.split("/").pop()}`}>{character.origin.name}</a>
                    </InfoRow>
                    <InfoRow label="Location">
                        <a href={`/location/${character.location.url.split("/").pop()}`}>{character.location.name}</a>
                    </InfoRow>
                </InfoTable>
            </div>
        </div>
    );
}
