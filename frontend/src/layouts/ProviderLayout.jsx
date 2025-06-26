import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";

export default function ProviderLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
