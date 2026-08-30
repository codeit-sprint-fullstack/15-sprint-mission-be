import logo from "../../assets/images/logo/logo.svg";
import "./Header.css";

function Header() {
  return (
    <header className="global-header">
      <div className="header-left">
        <a href="/" className="header-logo-link">
          <img
            src={logo}
            alt="판다마켓 홈"
            className="header-logo"
          />
        </a>

        <nav aria-label="주요 메뉴">
          <ul className="header-nav-list">
            <li>
              <a href="/community" className="header-nav-link">
                자유게시판
              </a>
            </li>
            <li>
              <a href="/" className="header-nav-link">
                중고마켓
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <button type="button" className="login-button">
        로그인
      </button>
    </header>
  );
}

export default Header;