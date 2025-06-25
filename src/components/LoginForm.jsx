import React, { useState } from 'react';
import { User } from 'lucide-react';

const LoginForm = ({ onLogin, users }) => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = async () => {
   // const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
   let user = null;
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });
      if (response.ok) {
        user = await response.json();
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    } 
   
   console.log(user);
    
    if (user) {
      onLogin(user.user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Connexion</h1>
          <p className="text-gray-600">Accédez à votre plateforme d'examens</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Se connecter
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Comptes de test :</p>
          <div className="text-xs space-y-1">
            <div>Admin: admin@test.com / 123</div>
            <div>Formateur: formateur@test.com / 123</div>
            <div>Etudiant: etudiant@test.com / 123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 