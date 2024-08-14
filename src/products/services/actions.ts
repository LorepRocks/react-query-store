import { type Product, productsApi } from "..";

interface GetProductsOptions {
  filterKey?: string;
}

const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time * 1000);
  });
};

export const getProducts = async ({
  filterKey,
}: GetProductsOptions): Promise<Product[]> => {
  const filterURL = filterKey ? `?category=${filterKey}` : "";
  const { data } = await productsApi.get<Product[]>(`/products${filterURL}`);
  return data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await productsApi.get<Product>(`/products/${id}`);
  return data;
};

export interface ProductLike {
  id?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const createProduct = async (product: ProductLike) => {
  await sleep(5);
  throw new Error("error creating new product");
  const { data } = await productsApi.post<Product>(`products`, product);
  return data;
};
