import { Episode } from '../components/Episode/Episode';
import { Pagination } from '../components/Pagination/Pagination';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { RamEpisode, RamPage } from '../types/ramTypes';
import { fetchRAM } from '../utils/fetchUtils';

type EpisodesPageProps = {
  currentPage: number;
};

export async function EpisodesPage({ currentPage }: EpisodesPageProps) {
  const page = await fetchRAM<RamPage<RamEpisode>>(
    `/episode?page=${currentPage}`
  );

  return (
    <DefaultLayout>
      <head>
        <title>Episodes</title>
      </head>
      <div>
        {page.results.map((episode) => (
          <Episode episode={episode} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={page.info.pages}
        url={(page) => `/episodes?page=${page}`}
      />
    </DefaultLayout>
  );
}
