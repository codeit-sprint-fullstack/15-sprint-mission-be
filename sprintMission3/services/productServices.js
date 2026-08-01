import axios from "axios";

const BASE_URL = "https://panda-market-api-crud.vercel.app";

export async function getProductList(page = 1, pageSize = 10, keyword = "") {
  try {
    const res = await axios.get(`${BASE_URL}/products`, {
      params: { page, pageSize, keyword },
    });
    return res.data;
  } catch (err) {
    console.error("목록 조회 실패:", err.response?.status, err.response?.data); //err.message에서 에러원인이 명확하게 뜨지 않아서 err.response?.data로 수정
  }
}

export async function createProduct(name, description, price, tags, images) {
  try {
    const res = await axios.post(`${BASE_URL}/products`, {
      name, description, price, tags, images,
    });
    return res.data;
  } catch (err) {
    console.error("생성 실패:", err.response?.status, err.response?.data);
  }
}

export async function getProduct(id) {
  try {
    const res = await axios.get(`${BASE_URL}/products/${id}`);
    return res.data;
  } catch (err) {
      console.error("상세 조회 실패:", err.response?.status, err.response?.data);
    }
  }

  export async function patchProduct(id, updateData) {
    try {
      const res = await axios.patch(`${BASE_URL}/products/${id}`, updateData);
      return res.data;
    } catch (err) {
      console.error("수정 실패:", err.response?.status, err.response?.data);
    }
  }

  export async function deleteProduct(id) {
    try {
      const res = await axios.delete(`${BASE_URL}/products/${id}`);
      return res.data;
    } catch (err) {
      console.error("삭제 실패", err.response?.status, err.response?.data);
    }
  }