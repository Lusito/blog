import { Character } from '../components/Character/Character';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { RamCharacter, RamPage } from '../types/ramTypes';
import { fetchRAM } from '../utils/fetchUtils';

type CharactersPageProps = {
  page: number;
};

export async function CharactersPage({ page }: CharactersPageProps) {
  const data = await fetchRAM<RamPage<RamCharacter>>(`/character?page=${page}`);

  return (
    <DefaultLayout>
      <head>
        <title>Characters</title>
      </head>
      <div>
        {data.results.map((character) => (
          <Character character={character} />
        ))}
      </div>
      <Pagination active={page} count={data.info.pages} />
    </DefaultLayout>
  );
}

// fixme: move elsewhere and style
type PaginationProps = {
  active: number;
  count: number;
};

const Pagination = ({ active, count }: PaginationProps) => (
  <ul>
    {Array.from({ length: count }, (_, index) => {
      const page = index + 1;
      return (
        <li>
          {page === active ? (
            page
          ) : (
            <a href={`/characters?page=${page}`}>{page}</a>
          )}
        </li>
      );
    })}
  </ul>
);
