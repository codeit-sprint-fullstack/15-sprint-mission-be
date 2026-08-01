const BASE_URL = "https://panda-market-api-crud.vercel.app";

export function getArticleList(page=1, pageSize=10, keyword="") {
  const query = `?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;
  return fetch(`${BASE_URL}/articles${query}`)
  .then((res) => {
    if (!res.ok) throw new Error(`목록 조회 실패: ${res.status}`);
    return res.json();
  })
  .catch((err) => console.error(err.message));
}

export function getArticle(id) {
  return fetch(`${BASE_URL}/articles/${id}`)
  .then((res) => {
    if (!res.ok) throw new Error(`상세 조회 실패: ${res.status}`);
    return res.json();
  })
  .catch((err) => console.error(err.message));
}

export function createArticle(title, content, image) {
  return fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, image }),
  })
  .then((res) => {
    if (!res.ok) throw new Error(`생성 실패: ${res.status}`);
    return res.json();
  })
  .catch((err) => console.error(err.message));
}

export function patchArticle(id, updateData) {
  return fetch(`${BASE_URL}/articles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(updateData),
  })
  .then((res) => {
    if (!res.ok) throw new Error(`수정 실패: ${res.status}`);
    return res.json();
  })
  .catch((err) => console.error(err.message));
}

export function deleteArticle(id) {
  return fetch(`${BASE_URL}/articles/${id}`, {
    method: "DELETE",
  })
  .then((res) => {
   if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
   return res.json();
  })
  .catch((err) => console.error(err.message));
}