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
    },
  );

  if (!response.ok) {
    throw new Error(`상품 목록 조회 실패: ${response.status}`);
  }

  return response.json();
}

// 새로운 상품 정보를 백엔드에 등록
export async function createProduct(productData) {
  const response = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",

    //요청 본문이 json 형식임을 서버에 알림
    headers: {
      "Content-Type": "application/json",
    },

    //상품 객체를 JSON 문자열로 변환해 전송
    body: JSON.stringify(productData),
  });

  //서버가 등록 요청을 거절하면 오류 발생
  if (!response.ok) {
    throw new Error(`상품 등록 실패: ${response.status}`);
  }

  //서버가 반환한 생성 상품을 객체로 변환
  return response.json();
}
