const BASE_URL = "https://panda-market-api.vercel.app";

export async function getProducts({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
  keyword = "",
  signal,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    orderBy,
  });

  if (keyword.trim()) {
    params.set("keyword", keyword.trim());
  }

  const response = await fetch(`${BASE_URL}/products?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`상품 목록 조회 실패: ${response.status}`);
  }

  return response.json();
}
