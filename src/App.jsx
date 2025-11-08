import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";
import Dashboard from "./pages/Dashboard";
import SocialPage from "./pages/SocialPage";
import ContactPage from "./pages/ContactPage";
import Marketplace from "./pages/Marketplace";
import QuotesPage from "./pages/QuotesPage";
import { MarketplaceProvider } from "./context/MarketplaceContext";
import "./styles/global.css";
const router = createBrowserRouter([
  { path: "/", element: <LoginRegister /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/social", element: <SocialPage /> },
  { path: "/contato", element: <ContactPage /> },
  { path: "/cotacoes", element: <QuotesPage /> },
  { path: "/marketplace", element: <Marketplace /> },
]);

export default function App() {
  return (
    <MarketplaceProvider>
      <RouterProvider router={router} />
    </MarketplaceProvider>
  );
}
