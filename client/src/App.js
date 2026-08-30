import Header from "./components/Layout/Header";
import MarketPage from "./pages/MarketPage/MarketPage";
import Footer from "./components/Layout/Footer";

function App() {
  return (
    <>
      <Header />

      <div className="with-header">
        <MarketPage />
      </div>
      <Footer />
    </>
  );
}

export default App;