import React, { useState } from "react";
import { FaUser, FaSun, FaMoon } from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { MdSchool, MdPeople, MdSettings } from "react-icons/md";

const Adminlayout = ({ children }: { children: React.ReactNode }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`flex h-screen ${isDarkTheme ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="text-center text-2xl font-bold py-4 border-b border-gray-700">
          NotesUp.
        </div>
        <nav className="flex flex-col mt-4 space-y-2 px-4">
          <a
            href="/admin/filieres"
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
          >
            <AiFillDashboard className="text-xl" />
            Gestion Filière
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
          >
            <MdSchool className="text-xl" />
            Gestion Module
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
          >
            <MdPeople className="text-xl" />
            Gestion Étudiant
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
          >
            <MdSettings className="text-xl" />
            Gestion Comptes
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {/* Navbar */}
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Sélectionner Promo
            </button>
          </div>
          <div className="flex items-center gap-4">
          <button
              onClick={toggleTheme}
              className="p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {isDarkTheme ? <FaSun /> : <FaMoon />}
            </button>
            <FaUser className="text-xl cursor-pointer hover:text-gray-500" />
            
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
 
          {children}
        </main>
      </div>
    </div>
  );
};

export default  Adminlayout;
 

