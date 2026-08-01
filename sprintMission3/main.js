import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./services/articleServices.js";
import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./services/productServices.js";

async function testArticle() {
  getArticleList(1, 5, "").then((data) => console.log("게시들 목록:", data));

  const created = await createArticle(
    "테스트 게시글",
    "내용입니다",
    "https://picsum.photos/200"
  );
  console.log("생성된 게시글", created);

  const detail = await getArticle(created.id);
  console.log("게시글 상세:", detail);

  const updated = await patchArticle(created.id, { title: "수정된 제목" });
  console.log("게시글 수정:", updated);

  const deleted = await deleteArticle(created.id);
  console.log("게시글 삭제", deleted);
}

async function testProduct() {
  getProductList(1, 5, "").then((data) => console.log("상품 목록:", data));

  const created = await createProduct(
    "테스트 상품",
    "설명입니다",
    10000,
    ["tag1"],
    ["https://picsum.photos/200"]
  );
  console.log("생성된 상품:", created);

  const detail = await getProduct(created.id);
  console.log("상품 상세:", detail);

  const updated = await patchProduct(created.id, { price: 5000 });
  console.log("상품 수정:", updated);

  const deleted = await deleteProduct(created.id);
  console.log("상품 삭제:", deleted);
}

await testArticle();
await testProduct();