import { renderChildren } from './app/renderChildren';
import express from 'express';
import { DemoPage } from './pages/DemoPage';
import { TodosPage } from './pages/TodosPage';
import { TodoPage } from './pages/TodoPage';

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
