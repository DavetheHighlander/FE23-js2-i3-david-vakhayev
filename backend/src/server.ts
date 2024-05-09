// server.ts
import express from 'express';
import path from 'path';
import { productController } from './controllers/productController';

const app = express();
const PORT = 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', productController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
