import React, { useState } from 'react';

const ExamTaking = ({ currentExam, onSubmitExam, onCancel ,currentUser}) => {
  const [examAnswers, setExamAnswers] = useState({});

  const handleSubmit = async () => {
    const score = currentExam.questions.reduce((total, question, index) => {
      return total + (examAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    
   
      const response = await fetch('http://localhost:8080/api/results/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: currentExam.id,
          etudiantId: currentUser.id,
          score: (score / currentExam.questions.length) * 100,
          answers: JSON.stringify(examAnswers)
        }),
      });
      const data = await response.json();
      if (data.success) {
        onSubmitExam({
          answers: examAnswers,
          score: (score / currentExam.questions.length) * 100
        });
      } else {
        console.log(data);
        
      }

  
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentExam.title}</h2>
      
      <div className="space-y-6">
        {currentExam?.questions?.map((question, questionIndex) => {
  
          
          const options = [
            question.option1,
            question.option2,
            question.option3,
            question.option4
          ];
          return (
            <div key={question.id} className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">
                {questionIndex + 1}. {question.question}
              </h3>
              <div className="space-y-2">
                {options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={optionIndex }
                      checked={examAnswers[questionIndex] == optionIndex }
                      onChange={() => setExamAnswers(prev => ({ ...prev, [questionIndex]: optionIndex  }))}
                      className="text-indigo-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          disabled={Object.keys(examAnswers).length !== currentExam.questions.length}
        >
          Soumettre l'examen
        </button>
      </div>
    </div>
  );
};

export default ExamTaking; 