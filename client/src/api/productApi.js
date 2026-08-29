const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function getProducts({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
  keyword = "",
  signal,
} = {}) {
  // 프론트엔드 페이지 번호를 백엔드 offset 방식으로 변환합니다.
  const offset = (page - 1) * pageSize;

  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(pageSize),
    orderBy,
  });

  if (keyword.trim()) {
    params.set("keyword", keyword.trim());
  }

  const response = await fetch(
    `${BASE_URL}/api/products?${params.toString()}`,
    {
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(`상품 목록 조회 실패: ${response.status}`);
  }

  return response.json();
}
