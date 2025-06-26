// frontend/src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, ClipboardList, PieChart } from "lucide-react";

const navItems = [
  { icon: <Home className="w-6 h-6" />, path: "/provider" },
  { icon: <Calendar className="w-6 h-6" />, path: "/provider/agenda" },
  { icon: <ClipboardList className="w-6 h-6" />, path: "/provider/services" },
  // Puedes agregar más entradas según se necesite
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 text-white w-20 flex flex-col items-center py-6 space-y-6">
      <div className="text-2xl font-bold text-indigo-400">🌊</div>
      {navItems.map((item, idx) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={idx}
            to={item.path}
            className={`p-2 rounded-md hover:bg-gray-700 transition ${
              isActive ? "bg-gray-700" : ""
            }`}
            aria-label={`Ir a ${item.path}`}
          >
            {item.icon}
          </Link>
        );
      })}
    </nav>
  );
}
