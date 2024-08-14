import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, productActions } from "..";

export const useProductMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: productActions.createProduct,
    onMutate: (product) => {
      console.log("mutando optimistic update");

      // optimistic Product
      const optimisticProduct = { id: Math.random(), ...product };
      console.log(optimisticProduct);

      // save the product on query client cache
      queryClient.setQueryData<Product[]>(
        ["products", { filterKey: product.category }],
        (prev) => {
          if (!prev) return [optimisticProduct];
          return [...prev, optimisticProduct];
        }
      );

      return {
        optimisticProduct,
      };
    },
    onSuccess: (product, variables, context) => {
      console.log({ product, variables, context });
      // this invalidate query will make the request again to return the products
      /*  queryClient.invalidateQueries({
        queryKey: ["products", { filterKey: data.category }],
      }); */

      queryClient.removeQueries({
        queryKey: ["product", context?.optimisticProduct.id],
      });
      // other approach could be to just add this new product in the exists data
      queryClient.setQueryData<Product[]>(
        ["products", { filterKey: product.category }],
        (prev) => {
          if (!prev) return [product];

          return prev.map((cachedProducts) => {
            return cachedProducts.id === context?.optimisticProduct.id
              ? product
              : cachedProducts;
          });
        }
      );
    },
    onError: (_error, variables, context) => {
      queryClient.removeQueries({
        queryKey: ["product", context?.optimisticProduct.id],
      });

      queryClient.setQueryData<Product[]>(
        ["products", { filterKey: variables.category }],
        (prev) => {
          if (!prev) return [];

          return prev.filter((cachedProducts) => {
            return cachedProducts.id !== context?.optimisticProduct.id;
          });
        }
      );
    },
  });
  return mutation;
};
