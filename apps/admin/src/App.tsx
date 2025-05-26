import { RouterProvider } from "@tanstack/react-router";
import "rsuite/dist/rsuite.min.css";
import { router } from "./router/Router";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
