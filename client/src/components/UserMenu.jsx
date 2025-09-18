import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserMenu = ({ onShowAuth, onShowSaved }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) {
    return (
      <button
        onClick={onShowAuth}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Iniciar Sesión
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
      >
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
          {user.username[0].toUpperCase()}
        </div>
        <span>{user.username}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => {
                onShowSaved();
                setShowDropdown(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Mis Formaciones
            </button>
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;