import { renderChildren } from './utils/renderChildren';
import express from 'express';
import { DemoPage } from './pages/DemoPage';
import { TodosPage } from './pages/TodosPage';
import { TodoPage } from './pages/TodoPage';
import { CharactersPage } from './pages/CharactersPage';
import { CharacterPage } from './pages/CharacterPage';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const html = await renderChildren(<DemoPage />);
  res.send(html);
});

app.get('/todos', async (req, res) => {
  const html = await renderChildren(<TodosPage />);
  res.send(html);
});

app.get('/todos/:id', async (req, res) => {
  const html = await renderChildren(<TodoPage id={req.params.id} />);
  res.send(html);
});

app.get('/characters', async (req, res) => {
  const html = await renderChildren(
    <CharactersPage currentPage={parseInt((req.query.page as string) || '1')} />
  );
  res.send(html);
});

app.get('/characters/:id', async (req, res) => {
  const html = await renderChildren(<CharacterPage id={req.params.id} />);
  res.send(html);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
