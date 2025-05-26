import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CustomProvider } from "rsuite";
import "./styles/main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CustomProvider theme="dark">
      <App />
    </CustomProvider>
  </StrictMode>
);
