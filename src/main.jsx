import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MyApp from "./components/app";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/v7">
    <MyApp/>
  </BrowserRouter>
);
