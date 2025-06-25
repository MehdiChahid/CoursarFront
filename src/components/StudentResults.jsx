import React from 'react';

const StudentResults = ({ results, exams, currentUser }) => {
  // Associer chaque résultat à son titre d'examen
  const getExamTitle = (examId) => {
    const exam = exams.find(e => e.id === (examId || (e.exam && e.exam.id)));
    return exam ? exam.title : 'Examen supprimé';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Mes résultats</h2>
      <div className="space-y-4">
        {results.map(result => (
          <div key={result.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{getExamTitle(result.exam?.id || result.examId)}</h3>
                <p className="text-sm text-gray-600">
                  Passé le {new Date(result.datePassage || result.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  result.score >= 70 ? 'text-green-600' : 
                  result.score >= 50 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {result.score.toFixed(1)}%
                </div>
                <div className={`text-sm ${
                  result.score >= 70 ? 'text-green-600' : 
                  result.score >= 50 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {result.score >= 70 ? 'Réussi' : result.score >= 50 ? 'Passable' : 'Échec'}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {results.length === 0 && (
          <p className="text-gray-500 text-center py-8">Aucun résultat disponible</p>
        )}
      </div>
    </div>
  );
};

export default StudentResults; 