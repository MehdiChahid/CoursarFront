import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const UserManagement = ({ users, onAddUser ,setEtudiantRaport }) => {
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'etudiant', name: '' });

  const handleAddUser = async () => {
    if (newUser.email && newUser.password && newUser.name) {
      try {
        const response = await fetch('http://localhost:8080/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
        const data = await response.json();
        if (data.success) {
          onAddUser(data.user);
          setNewUser({ email: '', password: '', role: 'etudiant', name: '' });
        } else {
          alert('Erreur lors de l\'ajout');
        }
      } catch (error) {
        alert('Erreur serveur');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Ajouter un utilisateur */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ajouter un utilisateur</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nom"
            value={newUser.name}
            onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={newUser.password}
            onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="etudiant">Étudiant</option>
            <option value="formateur">Formateur</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Ajouter
        </button>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Liste des utilisateurs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Nom</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'formateur' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3">
                    {user.role === 'etudiant' && (
                      <button
                        onClick={() => setEtudiantRaport(user.id)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-xs" >
                        Voir rapport
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 