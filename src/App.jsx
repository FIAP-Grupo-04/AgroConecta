import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";
import Dashboard from "./pages/Dashboard";
import SocialPage from "./pages/SocialPage";
import ContactPage from "./pages/ContactPage";
import "./styles/global.css";

const router = createBrowserRouter([
  { path: "/", element: <LoginRegister /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/social", element: <SocialPage /> },
  { path: "/contato", element: <ContactPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
