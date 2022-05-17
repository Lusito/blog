import { RamCharacter } from "../../types/ramTypes";
import { Css } from "../Css";
import { InfoRow, InfoTable } from "../InfoTable/InfoTable";
import classes from "./Character.module.css";

const genderSymbols = {
    Female: "♀",
    Male: "♂",
    Genderless: "⚲",
};

export type CharacterProps = {
    character: RamCharacter;
};

export function Character({ character }: CharacterProps) {
    return (
        <div class={classes.character}>
            <Css style={classes} />
            <a href={`/character/${character.id}`}>
                <img src={character.image} class={classes.characterImage} alt="Profile Picture" />
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
                        <a href={character.origin.url.replace("https://rickandmortyapi.com/api/", "")}>
                            {character.origin.name}
                        </a>
                    </InfoRow>
                    <InfoRow label="Location">
                        <a href={character.location.url.replace("https://rickandmortyapi.com/api/", "")}>
                            {character.location.name}
                        </a>
                    </InfoRow>
                </InfoTable>
            </div>
        </div>
    );
}
