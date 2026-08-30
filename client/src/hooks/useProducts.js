import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";

function useProducts({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
  keyword = "",
} = {}) {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProducts({
          page,
          pageSize,
          orderBy,
          keyword,
          signal: controller.signal,
        });

        setProducts(data.list);
        setTotalCount(data.totalCount);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [page, pageSize, orderBy, keyword]);

  return {
    products,
    totalCount,
    isLoading,
    error,
  };
}

export default useProducts;