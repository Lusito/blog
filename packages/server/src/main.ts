import { renderExample } from './app/render';
import express from 'express';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const html = await renderExample();
  res.send(html);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
