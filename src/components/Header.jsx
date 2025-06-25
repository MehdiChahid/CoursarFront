import React from 'react';
import { BookOpen, LogOut } from 'lucide-react';

const Header = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="text-white text-sm" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">ExamPro</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {currentUser.name} ({currentUser.role})
            </span>
            <button
              onClick={onLogout}
              className="flex items-center text-red-600 hover:text-red-700 text-sm"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 