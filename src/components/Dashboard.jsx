import React from 'react';
import { Users, BookOpen, Award } from 'lucide-react';

const Dashboard = ({ users, exams, results }) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Users className="text-blue-600 w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Utilisateurs</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-lg">
            <BookOpen className="text-green-600 w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Examens</p>
            <p className="text-2xl font-bold text-gray-900">{exams?.length || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Award className="text-purple-600 w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Résultats</p>
            <p className="text-2xl font-bold text-gray-900">{results.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 