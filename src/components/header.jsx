import { Link } from "react-router-dom";
import logo from "../assets/logo.png";  // Adjust the path as necessary

const Header = ({ hideNav = false, hideLogin = false }) => {
  return (
    <header className="bg-pink-100 shadow-md border-b border-pink-200">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Tasty Cake & Bakers Logo"
            className="h-14 w-14 rounded-full border-2 border-pink-300 shadow-sm"
          />
          <span className="text-2xl font-bold text-pink-800">Tasty Cake & Bakers</span>
        </Link>

        {/* Hide the entire nav when hideNav is true */}
        {!hideNav && (
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className="text-lg font-medium text-pink-700 hover:text-pink-500 transition"
                >
                  home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-lg font-medium text-pink-700 hover:text-pink-500 transition"
                >
                  about
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-lg font-medium text-pink-700 hover:text-pink-500 transition"
                >
                  contact
                </Link>
              </li>
              {!hideLogin && (
              <li>
                <Link 
                  to="/login" 
                  className="text-lg font-medium text-pink-700 hover:text-pink-500 transition"
                  title="Login"
                >
                  login
                </Link>
              </li>
            )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
