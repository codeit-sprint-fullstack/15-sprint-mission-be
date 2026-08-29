import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* 브라우저 라우터 모든 페이지에서 URL 기반 라우팅을 사용할 수 있게 해줌 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
