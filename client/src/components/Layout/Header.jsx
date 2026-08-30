import logo from "../../assets/images/logo/logo.svg";
import "./Header.css";
import { Link, NavLink } from "react-router";


function Header() {
  return (
    <header className="global-header">
      <div className="header-left">
        <Link to="/" className="header-logo-link">
          <img
            src={logo}
            alt="판다마켓 홈"
            className="header-logo"
          />
        </Link>

        <nav aria-label="주요 메뉴">
          <ul className="header-nav-list">
            <li>
              <a href="/community" className="header-nav-link">
                자유게시판
              </a>
            </li>
            <li>
              <NavLink
                to="/items"
                className={({isActive}) =>
                isActive
                  ? "header-nav-link header-nav-link-active"
                  : "header-nav-link"
                }
              >
                중고마켓
              </NavLink>
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