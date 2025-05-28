import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const CustomerHeader = ({ onCartClick, onProfileClick, hideHome = false}) => {
  return (
    <header className="bg-pink-100 shadow-md border-b border-pink-200">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center space-x-4">
          <img src={logo} alt="Tasty Cake & Bakers Logo" className="h-14 w-14 rounded-full border-2 border-pink-300 shadow-sm" />
          <span className="text-2xl font-bold text-pink-800">Tasty Cake & Bakers</span>
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
          {!hideHome && (
              <li>
                <Link
                  to="/"
                  className="text-lg font-medium text-pink-700 hover:text-pink-500 transition"
                  title="Home"
                >
                  Home
                </Link>
              </li>
            )}
            <li>
              <button
                onClick={onCartClick}
                className="p-2 rounded-full hover:bg-gray-200"
                title="Cart"
              >
                {/* Cart SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#8c2673]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="9" cy="21" r="1.5" fill="currentColor"/>
                  <circle cx="19" cy="21" r="1.5" fill="currentColor"/>
                  <path stroke="currentColor" strokeWidth="2" d="M5 6h2l1 7h9l1.5-6H7"/>
                </svg>
              </button>
            </li>
            <li>
              <button
                onClick={onProfileClick}
                className="p-2 rounded-full hover:bg-gray-200"
                title="Profile"
              >
                {/* Profile SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#8c2673]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path stroke="currentColor" strokeWidth="2" d="M4 20c0-4 8-4 8-4s8 0 8 4" fill="none"/>
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default CustomerHeader;
