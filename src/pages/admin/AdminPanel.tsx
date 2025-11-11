import { Link, Routes, Route, useLocation } from "react-router-dom";
import ManageCats from "./ManageCats";
import ManageBreeds from "./ManageBreeds";
import ManageFacts from "./ManageFacts";
import ManageDevelopers from "./ManageDevelopers";

export default function AdminPanel() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 sticky top-0 h-screen">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-amber-600">Admin</h2>
          <p className="text-sm text-gray-500">Manage application data</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            to="/admin/cats"
            className={`text-left px-3 py-2 rounded transition-colors ${
              isActive("/admin/cats")
                ? "bg-amber-100 text-amber-800 font-medium"
                : "hover:bg-amber-50 text-amber-700"
            }`}
          >
            Manage Cats
          </Link>
          <Link
            to="/admin/breeds"
            className={`text-left px-3 py-2 rounded transition-colors ${
              isActive("/admin/breeds")
                ? "bg-amber-100 text-amber-800 font-medium"
                : "hover:bg-amber-50 text-amber-700"
            }`}
          >
            Manage Breeds
          </Link>
          <Link
            to="/admin/facts"
            className={`text-left px-3 py-2 rounded transition-colors ${
              isActive("/admin/facts")
                ? "bg-amber-100 text-amber-800 font-medium"
                : "hover:bg-amber-50 text-amber-700"
            }`}
          >
            Manage Cat Facts
          </Link>
          <Link
            to="/admin/developers"
            className={`text-left px-3 py-2 rounded transition-colors ${
              isActive("/admin/developers")
                ? "bg-amber-100 text-amber-800 font-medium"
                : "hover:bg-amber-50 text-amber-700"
            }`}
          >
            Manage Developers
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="cats" element={<ManageCats />} />
          <Route path="breeds" element={<ManageBreeds />} />
          <Route path="facts" element={<ManageFacts />} />
          <Route path="developers" element={<ManageDevelopers />} />
          <Route
            path="/"
            element={
              <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Welcome to Admin Panel
                </h1>
                <p className="text-gray-600">
                  Select a section from the sidebar to get started
                </p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
