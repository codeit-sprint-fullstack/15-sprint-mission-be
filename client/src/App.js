import Header from "./components/Layout/Header";
import MarketPage from "./pages/MarketPage/MarketPage";
import Footer from "./components/Layout/Footer";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage/LandingPage";
import ResistrationPage from "./pages/RegistrationPage/RegistrationPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";

function App() {
  return (
    <>
      <Header />

      <div className="with-header">
        {/* 현재 URL과 일치하는 페이지 컴포넌트만 렌더링 한다. */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/items" element={<MarketPage />} />
          <Route path="/registration" element={<ResistrationPage />} />
          <Route path="/items/:id" element={<ProductDetailPage/>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;