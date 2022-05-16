import { respondHTML } from './utils/renderHTML';
import express from 'express';
import { DemoPage } from './pages/DemoPage';
import { ramRouter } from './routers/ramRouter';

const app = express();
const port = 3000;

app.get('/', (req, res) => respondHTML(res, <DemoPage />));

app.use(ramRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
