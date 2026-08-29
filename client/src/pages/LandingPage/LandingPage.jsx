import { Link } from "react-router";
import heroImage from "../../assets/images/landing/Img_home_top.png";
import "./LandingPage.css";
import hotItemImage from "../../assets/images/landing/Img_home_01.png";
import searchImage from "../../assets/images/landing/Img_home_02.png";
import registerImage from "../../assets/images/landing/Img_home_03.png";
import bottomImage from "../../assets/images/landing/Img_home_bottom.png";

//랜딩 페이지 전체 화면을 담당하는 컴포넌트
function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-text">
            <h1 className="landing-hero-title">
              일상의 모든 물건을
              <br />
              거래해 보세요
            </h1>

            <Link className="landing-hero-link" to="/items">
              구경하러 가기
            </Link>
          </div>

          <img
            className="landing-hero-image"
            src={heroImage}
            alt="판다마켓 상품을 구경하는 판다"
          />
        </div>
      </section>

      <section className="landing-feature">
        <div className="landing-feature-content">
          <img
            className="landing-feature-image"
            src={hotItemImage}
            alt="판다마켓 인기 상품"
          />
          <div className="landing-feature-text">
            <p className="landing-feature-label">Hot item</p>
            <h2 className="landing-feature-title">
              인기 상품을
              <br />
              확인해보세요
            </h2>

            <p className="landing-feature-description">
              가장 HOT한 중고거래 물품을
              <br />
              판다마켓에서 확인해보세요
            </p>
          </div>
        </div>
      </section>

      <section className="landing-feature landing-feature-reverse">
        <div className="landing-feature-content">
          <div className="landing-feature-text">
            <p className="landing-feature-label">Search</p>

            <h2 className="landing-feature-title">
              구매를 원하는
              <br />
              상품을 검색하세요
            </h2>

            <p className="landing-feature-description">
              구매하고 싶은 물품은 검색해서
              <br />
              쉽게 찾아보세요
            </p>
          </div>

          <img
            className="landing-feature-image"
            src={searchImage}
            alt="판다마켓 상품 검색"
          />
        </div>
      </section>

      <section className="landing-feature">
        <div className="landing-feature-content">
          <img
            className="landing-feature-image"
            src={registerImage}
            alt="판다마켓 상품 등록"
          />

          <div className="landing-feature-text">
            <p className="landing-feature-label">Register</p>
            <h2 className="landing-feature-title">
              판매를 원하는
              <br />
              상품을 등록하세요
            </h2>

            <p className="landing-feature-description">
              어떤 물건이든 판매하고 싶은 상품을
              <br />
              쉽게 등록하세요
            </p>
          </div>
        </div>
      </section>

      <section className="landing-bottom-banner">
        <div className="landing-bottom-content">
          <h2 className="landing-bottom-title">
            믿을 수 있는
            <br />
            판다마켓 중고 거래
          </h2>

          <img
            className="landing-bottom-image"
            src={bottomImage}
            alt="판다마켓 중고 거래"
          />
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
