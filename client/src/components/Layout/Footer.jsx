import facebookIcon from "../../assets/images/social/facebook-logo.svg";
import twitterIcon from "../../assets/images/social/twitter-logo.svg";
import youtubeIcon from "../../assets/images/social/youtube-logo.svg";
import instagramIcon from "../../assets/images/social/instagram-logo.svg";
import "./Footer.css";

function Footer() {
return (
  <footer>
    <div className="footer-copyright">©codeit - 2026</div>

    <div className="footer-menu">
      <a href="/privacy">Privacy Policy</a>
      <a href="/faq">FAQ</a>
    </div>
    <div className="footer-social">
      <a
        href="https://www.facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={facebookIcon} alt="페이스북" width="20" />
      </a>
      <a
        href="https://twitter.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={twitterIcon} alt="트위터" width="20" />
      </a>
      <a
        href="https://www.youtube.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={youtubeIcon} alt="유튜브" width="20" />
      </a>
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={instagramIcon} alt="인스타그램" width="20" />
      </a>
    </div>
  </footer>
);
}

export default Footer;