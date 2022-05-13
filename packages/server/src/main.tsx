import { renderChildren } from './utils/renderChildren';
import express from 'express';
import { DemoPage } from './pages/DemoPage';
import { CharactersPage } from './pages/CharactersPage';
import { CharacterPage } from './pages/CharacterPage';
import { LocationsPage } from './pages/LocationsPage';
import { LocationPage } from './pages/LocationPage';
import { EpisodesPage } from './pages/EpisodesPage';
import { EpisodePage } from './pages/EpisodePage';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const html = await renderChildren(<DemoPage />);
  res.send(html);
});

app.get('/characters', async (req, res) => {
  const html = await renderChildren(
    <CharactersPage currentPage={parseInt((req.query.page as string) || '1')} />
  );
  res.send(html);
});

app.get('/character/:id', async (req, res) => {
  const html = await renderChildren(<CharacterPage id={req.params.id} />);
  res.send(html);
});

app.get('/locations', async (req, res) => {
  const html = await renderChildren(
    <LocationsPage currentPage={parseInt((req.query.page as string) || '1')} />
  );
  res.send(html);
});

app.get('/location/:id', async (req, res) => {
  const html = await renderChildren(<LocationPage id={req.params.id} />);
  res.send(html);
});

app.get('/episodes', async (req, res) => {
  const html = await renderChildren(
    <EpisodesPage currentPage={parseInt((req.query.page as string) || '1')} />
  );
  res.send(html);
});

app.get('/episode/:id', async (req, res) => {
  const html = await renderChildren(<EpisodePage id={req.params.id} />);
  res.send(html);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
