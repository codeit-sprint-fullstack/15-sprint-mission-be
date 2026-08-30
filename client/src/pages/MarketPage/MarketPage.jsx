import useDeviceType from "../../hooks/useDeviceType";
import useProducts from "../../hooks/useProducts";
import ItemCard from "./components/ItemCard";
import Pagination from "../../components/UI/Pagination";
import "./MarketPage.css";
import { useEffect, useState } from "react";
import searchIcon from "../../assets/images/icons/ic_search.svg";
import sortMobileIcon from "../../assets/images/icons/ic_sort_mobile.svg";

//임시연결
const BEST_PAGE_SIZE = {
  mobile: 1,
  tablet: 2,
  desktop: 4,
};

const ALL_PAGE_SIZE = {
  mobile: 4,
  tablet: 6,
  desktop: 10,
};

// const mockItems = [
//   {
//     id: 1,
//     name: "판다 인형",
//     price: 25000,
//     favoriteCount: 12,
//     images: [],
//   },
//   {
//     id: 2,
//     name: "무선 키보드",
//     price: 48000,
//     favoriteCount: 8,
//     images: [],
//   },
//   {
//     id: 3,
//     name: "캠핑 의자",
//     price: 32000,
//     favoriteCount: 21,
//     images: [],
//   },
//   {
//     id: 4,
//     name: "휴대용 스피커",
//     price: 39000,
//     favoriteCount: 15,
//     images: [],
//   },
// ];

function MarketPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState("recent");
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  //화면 크기 출력 test
  // const deviceType = useDeviceType();

  // console.log("현재 너비:", window.innerWidth)
  // console.log("화면 종류:", deviceType)

  const deviceType = useDeviceType();
  const allProductsPageSize = ALL_PAGE_SIZE[deviceType];

  useEffect(() => {
    setCurrentPage(1);
  }, [allProductsPageSize, orderBy, keyword]);

  // 베스트 상품 요청
  const {
    products: bestProducts,
    isLoading: isBestLoading,
    error: bestError,
  } = useProducts({
    page: 1,
    pageSize: BEST_PAGE_SIZE[deviceType],
    orderBy: "favorite",
  });

  // 판매 중인 상품 요청
  const {
    products: allProducts,
    totalCount: allProductsTotalCount,
    isLoading: isAllLoading,
    error: allError,
  } = useProducts({
    page: currentPage,
    pageSize: allProductsPageSize,
    orderBy,
    keyword,
  });

  const totalPages = Math.ceil(
    allProductsTotalCount / allProductsPageSize
  );

  //검색실행 함수 만들기
  function handleSearchSubmit(event) {
    event.preventDefault();
    setKeyword(searchInput);
  }

  function handleSearchInputChange(event) {
    const nextValue = event.target.value;

    setSearchInput(nextValue);

    if (nextValue === "") {
      setKeyword("");
    }
  }

  // console.log({
  //   deviceType,
  //   bestProducts,
  //   isBestLoading,
  //   bestError,
  // });

  return (
    <main className="market-page">
      <section className="market-section">
        <h1 className="market-section-title">베스트 상품</h1>

        {/* <div className="best-items-grid">
          {mockItems.map((item) => (
            <ItemCard key={`best-${item.id}`} item={item} />
          ))}
        </div> */}

        {isBestLoading ? (
          <p className="market-status">
            상품을 불러오는 중입니다.
          </p>
        ) : bestError ? (
          <p className="market-status market-status-error">
            상품을 불러오지 못했습니다.
          </p>
        ) : (
          <div className="best-items-grid">
            {bestProducts.map((item) => (
              <ItemCard key={`best-${item.id}`} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="market-section">
        <div className="market-section-header">
          <h1 className="market-section-title">
            판매 중인 상품
          </h1>

          <form
            className="market-search-form"
            onSubmit={handleSearchSubmit}
          >
            <button type="submit" aria-label="상품 검색">
              <img src={searchIcon} alt="" />
            </button>

            <input
              type="search"
              value={searchInput}
              onChange={handleSearchInputChange}
              placeholder="검색할 상품을 입력해주세요"
            />
          </form>

          <button
            type="button"
            className="product-register-button"
          >
            상품 등록하기
          </button>

          <div className="market-sort-control">
            <img
              className="market-sort-icon"
              src={sortMobileIcon}
              alt=""
              aria-hidden="true"
            />

            <select
              className="market-sort-select"
              value={orderBy}
              onChange={(event) =>
                setOrderBy(event.target.value)
              }
            >
              <option value="recent">최신순</option>
              <option value="favorite">좋아요순</option>
            </select>
          </div>
        </div>

        {isAllLoading ? (
          <p className="market-status">
            상품을 불러오는 중입니다.
          </p>
        ) : allError ? (
          <p className="market-status market-status-error">
            상품을 불러오지 못했습니다.
          </p>
        ) : allProducts.length === 0 ? (
          <p className="market-status">
            검색 결과가 없습니다.
          </p>
        ) : (
          <div className="all-items-grid">
            {allProducts.map((item) => (
              <ItemCard key={`all-${item.id}`} item={item} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          disabled={isAllLoading}
        />
      </section>
    </main>
  );
}

export default MarketPage;