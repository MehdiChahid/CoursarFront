import React from 'react';
import { Check } from 'lucide-react';

const AvailableExams = ({ exams, results, currentUser, onStartExam }) => {
  console.log(results);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Examens disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams?.map(exam => {
          debugger
          const hasResult = results.find(r => r.exam?.id == exam.id && r.etudiant?.id == currentUser.id);
          return (
            <div key={exam.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg">{exam.title}</h3>
              <p className="text-sm text-gray-600">{exam.questions.length} questions</p>
              <div className="mt-4">
                {hasResult ? (
                  <div className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    <span className="text-sm">Terminé ({hasResult.score.toFixed(1)}%)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onStartExam(exam)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Commencer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableExams; 