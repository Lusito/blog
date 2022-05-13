import { Character } from '../components/Character/Character';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { RamCharacter } from '../types/ramTypes';
import { fetchRAM } from '../utils/fetchUtils';

export type CharacterPageProps = {
  id: string;
};

export async function CharacterPage({ id }: CharacterPageProps) {
  const character = await fetchRAM<RamCharacter>(`/character/${id}`);

  return (
    <DefaultLayout>
      <head>
        <title>Character: {character.name}</title>
      </head>
      <Character character={character} />
    </DefaultLayout>
  );
}
