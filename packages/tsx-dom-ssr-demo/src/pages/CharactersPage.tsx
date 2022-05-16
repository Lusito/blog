import { Character } from '../components/Character/Character';
import { Pagination } from '../components/Pagination/Pagination';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { RamCharacter, RamPage } from '../types/ramTypes';
import { fetchRAM } from '../utils/fetchUtils';

type CharactersPageProps = {
  currentPage: number;
};

export async function CharactersPage({ currentPage }: CharactersPageProps) {
  const page = await fetchRAM<RamPage<RamCharacter>>(
    `/character?page=${currentPage}`
  );

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
      <Pagination
        currentPage={currentPage}
        totalPages={page.info.pages}
        url={(page) => `/characters?page=${page}`}
      />
    </DefaultLayout>
  );
}
