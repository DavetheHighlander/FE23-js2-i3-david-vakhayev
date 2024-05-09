import express from 'express';
import { Request, Response } from 'express';
import products from '../data/products.json';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json(products);
});

router.get('/search', (req: Request, res: Response) => {
  const searchTerm = req.query.q?.toString().toLowerCase();
  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm)
  );
  res.json(filteredProducts);
});

export { router as productController };
