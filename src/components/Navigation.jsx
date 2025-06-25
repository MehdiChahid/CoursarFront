import React from 'react';
import { User, Users, BookOpen, FileText, Award } from 'lucide-react';

const Navigation = ({ currentUser, activeTab, setActiveTab }) => {
  return (
    <nav className="mb-8">
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          Dashboard
        </button>
        
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Utilisateurs
          </button>
        )}
        
        {currentUser.role === 'formateur' && (
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'exams'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Examens
          </button>
        )}
        
        {currentUser.role === 'etudiant' && (
          <>
            <button
              onClick={() => setActiveTab('available-exams')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'available-exams'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Examens
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'results'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Résultats
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 