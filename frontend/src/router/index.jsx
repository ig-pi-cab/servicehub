import { createBrowserRouter } from "react-router-dom";
import ProviderLayout from "../layouts/ProviderLayout";
import DashboardPage from "../pages/provider/DashboardPage";
import AgendaPageOnly from "../pages/provider/AgendaPageOnly";
import ServicesPageOnly from "../pages/provider/ServicesPageOnly";

export const router = createBrowserRouter([
  {
    path: "/provider",
    element: <ProviderLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "agenda",
        element: <AgendaPageOnly />,
      },
      {
        path: "services",
        element: <ServicesPageOnly />,
      },
    ],
  },
]);
