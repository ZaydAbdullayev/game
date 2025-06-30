import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./home.jsx";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Game } from "./components/templates/index.jsx";

export const Layout = () => {
  return <Outlet />;
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="/game" element={<Game />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
