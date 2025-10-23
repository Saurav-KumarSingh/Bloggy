import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Simulate logged-in state for now
  const isLoggedIn = false; // You can later replace with actual auth check (e.g. JWT in localStorage)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Bloggy<span className="text-gray-800">Verse</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/posts" className="hover:text-blue-600 transition">
            Posts
          </Link>
          {isLoggedIn && (
            <Link to="/create-post" className="hover:text-blue-600 transition">
              Create Post
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => console.log("logout")}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center text-gray-700 focus:outline-none"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-100">
          <nav className="flex flex-col p-4 space-y-2 text-gray-700">
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/posts" className="hover:text-blue-600 transition">
              Posts
            </Link>
            {isLoggedIn && (
              <Link to="/create-post" className="hover:text-blue-600 transition">
                Create Post
              </Link>
            )}

            <hr className="my-2" />

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-600 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => console.log("logout")}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-center hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
