import { Character } from '../components/Character/Character';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { RamCharacter, RamPage } from '../types/ramTypes';
import { fetchRAM } from '../utils/fetchUtils';

export async function CharactersPage() {
  const page = await fetchRAM<RamPage<RamCharacter>>('/character');

  return (
    <DefaultLayout>
      <head>
        <title>Characters</title>
      </head>
      <div>
        {page.results.map((character) => (
          <Character character={character} />
        ))}
      </div>
    </DefaultLayout>
  );
}
