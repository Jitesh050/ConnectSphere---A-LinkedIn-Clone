import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { SearchIcon, UserIcon } from './Icons';

const Header: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    context?.logout();
    navigate('/auth');
  };

  if (!context || !context.currentUser) return null;
  const { currentUser } = context;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8 flex-1 min-w-0">
            <Link to="/" className="text-2xl font-bold text-primary flex-shrink-0">
              ConnectSphere
            </Link>
            <div className="relative hidden sm:block w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full bg-gray-100 border border-transparent rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Search posts..."
                  type="search"
                  value={context.searchQuery}
                  onChange={(e) => context.setSearchQuery(e.target.value)}
                />
            </div>
          </div>
          <div className="relative flex-shrink-0 ml-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </span>
              <span className="hidden sm:block font-medium text-gray-700">{currentUser.name}</span>
            </button>
            {dropdownOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <Link
                  to={`/profile/${currentUser.id}`}
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
