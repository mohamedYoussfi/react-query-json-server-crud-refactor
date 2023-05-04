import axios from "axios";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

export const productApi = axios.create({
  baseURL: "http://localhost:9000",
});

export const getProducts = (keyword, page, size) => {
  return productApi.get(
    `/products?name_like=${keyword}&_page=${page}&_limit=${size}`
  );
};
export const getProductById = (id) => {
  return productApi.get("/products/" + id);
};
export const checkProduct = (product) => {
  return productApi.patch(`/products/${product.id}`, {
    checked: product.checked,
  });
};

export const updateProduct = (product) => {
  return productApi.patch(`/products/${product.id}`, product);
};

export const deleteProduct = (product) => {
  return productApi.delete(`/products/${product.id}`);
};

export const addProduct = (product) => {
  return productApi.post(`/products`, product);
};

export const useGetProducts = (keyword, currentPage, pageSize, onSuccess) => {
  return useQuery(
    ["products", keyword, currentPage, pageSize],
    () => getProducts(keyword, currentPage, pageSize),
    {
      enabled: true,
      onSuccess: onSuccess,
    }
  );
};

export const useCheckProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(checkProduct, {
    onSuccess: (_, data) => {
      //queryClient.invalidateQueries("products") //allProductsQuery.refetch(),
      queryClient.setQueriesData("products", (oldQueryData) => {
        const newData = oldQueryData.data.map((p) => {
          if (p.id == data.id) return { ...p, checked: !p.checked };
          else return p;
        });
        return {
          ...oldQueryData,
          data: newData,
        };
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteProduct, {
    onSuccess: () => queryClient.invalidateQueries("products"),
  });
};

export const useNewProductMutation = () => {
  return useMutation(addProduct, {
    onSuccess: () => {},
  });
};

export const useGetProductByIdQuery = (id, setName, setPrice, setChecked) => {
  return useQuery(["product", id], () => getProductById(id), {
    onSuccess: (response) => {
      setName(response.data.name);
      setPrice(response.data.price);
      setChecked(response.data.checked);
    },
  });
};

export const useUpdateProductMutation = () => {
  return useMutation(updateProduct, {
    onSuccess: () => {},
  });
};
