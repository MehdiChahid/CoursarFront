import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Brain, 
  FileText, 
  Award, 
  Users, 
  Sparkles, 
  Loader, 
  CheckCircle, 
  XCircle,
  Trash2,
  Edit3,
  Eye,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';

const ExamManagement = ({ currentUser, results }) => {
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ title: '', questions: [] });
  const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', '', '', ''], correct: 0 });
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSubject, setAiSubject] = useState('');
  const [aiNumberOfQuestions, setAiNumberOfQuestions] = useState(5);
  const [expandedExam, setExpandedExam] = useState(null);

  // Charger les examens depuis le backend
  useEffect(() => {
    fetch('http://localhost:8080/api/exams')
      .then(res => res.json())
      .then(data => setExams(data))
      .catch(() => setExams([]));
  }, []);

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(opt => opt.trim())) {
      setNewExam(prev => ({
        ...prev,
        questions: [...prev.questions, { ...newQuestion, id: Date.now() }]
      }));
      setNewQuestion({ question: '', options: ['', '', '', ''], correct: 0 });
    }
  };

  const removeQuestion = (questionId) => {
    setNewExam(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const generateWithAI = async () => {
    if (!aiSubject.trim()) {
      alert('Veuillez saisir un sujet pour la génération IA');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: aiSubject,
          numberOfQuestions: aiNumberOfQuestions
        }),
      });

      const data = await response.json();
      
      if (data.success && data.questions) {
        // Ajouter les questions générées par IA à l'examen
        const aiQuestions = data.questions.map((q, index) => ({
          id: Date.now() + index,
          question: q.question,
          options: q.options,
          correct: q.correctAnswer
        }));
        
        setNewExam(prev => ({
          ...prev,
          questions: [...prev.questions, ...aiQuestions]
        }));
        
        setShowAIModal(false);
        setAiSubject('');
        setAiNumberOfQuestions(5);
      } else {
        alert(data.message || 'Erreur lors de la génération des questions');
      }
    } catch (error) {
      console.error('Erreur IA:', error);
      alert('Erreur de connexion à l\'API IA');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddExam = async () => {
    if (newExam.title && newExam.questions.length > 0) {
      try {
        const response = await fetch('http://localhost:8080/api/exams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newExam.title,
            formateurId: currentUser.id,
            questions: newExam.questions
          }),
        });
        const data = await response.json();
        if (data.success) {
          // Recharge la liste depuis le backend
          fetch('http://localhost:8080/api/exams')
            .then(res => res.json())
            .then(data => setExams(data));
          setNewExam({ title: '', questions: [] });
        } else {
          alert(data.message || "Erreur lors de la création de l'examen");
        }
      } catch (error) {
        alert("Erreur serveur lors de la création de l'examen");
      }
    }
  };

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const suggestedSubjects = [
    'JavaScript', 'Python', 'Java', 'React', 'Spring Boot',
    'HTML/CSS', 'Base de données', 'Algorithmique'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Gestion des Examens
          </h1>
          <p className="text-gray-600 text-lg">Créez et gérez vos examens avec l'assistance de l'IA</p>
        </div>

        {/* Créer un examen */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Créer un nouvel examen</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de l'examen</label>
            <input
              type="text"
              placeholder="Ex: Examen JavaScript Avancé"
              value={newExam.title}
              onChange={(e) => setNewExam(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Section Questions */}
          <div className="border-t-2 border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-indigo-600" />
                Ajouter des questions
              </h3>
              <button
                onClick={() => setShowAIModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Brain className="w-5 h-5 mr-2" />
                Générer avec IA
                <Sparkles className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Formulaire question manuelle */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Question</label>
                  <textarea
                    placeholder="Saisissez votre question ici..."
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    rows="3"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="correct"
                          checked={newQuestion.correct === index}
                          onChange={() => setNewQuestion(prev => ({ ...prev, correct: index }))}
                          className="w-4 h-4 text-indigo-600 border-2 border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="ml-2 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                          {getOptionLetter(index)}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder={`Option ${getOptionLetter(index)}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion(prev => ({ ...prev, options: newOptions }));
                        }}
                        className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={addQuestion}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter la question
                </button>
              </div>
            </div>

            {/* Questions ajoutées */}
            {newExam.questions.length > 0 && (
              <div className="bg-white border-2 border-indigo-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-indigo-600" />
                  Questions ajoutées ({newExam.questions.length})
                </h3>
                <div className="space-y-4 mb-6">
                  {newExam.questions.map((q, index) => (
                    <div key={q.id} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-2">
                            <span className="bg-indigo-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm mr-2">
                              {index + 1}
                            </span>
                            {q.question}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Réponse correcte:</span> {getOptionLetter(q.correct)} - {q.options[q.correct]}
                          </p>
                        </div>
                        <button
                          onClick={() => removeQuestion(q.id)}
                          className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleAddExam}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-6 h-6 inline mr-2" />
                  Créer l'examen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mes examens */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl mr-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Mes examens</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.filter(exam => exam.formateur.id == currentUser.id).map(exam => (
              <div key={exam.id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-indigo-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{exam.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                        {exam.questions.length} questions
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-green-500" />
                        {results.filter(r => r.examId === exam.id).length} participants
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
                    className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {expandedExam === exam.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
                
                {expandedExam === exam.id && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="space-y-2">
                      {exam.questions.slice(0, 3).map((question, index) => (
                        <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                          <span className="font-medium">{index + 1}.</span> {question.question.substring(0, 50)}...
                        </div>
                      ))}
                      {exam.questions.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          et {exam.questions.length - 3} autres questions...
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-indigo-100 text-indigo-700 py-2 px-3 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium">
                    <Edit3 className="w-4 h-4 inline mr-1" />
                    Modifier
                  </button>
                  <button className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                    <Award className="w-4 h-4 inline mr-1" />
                    Résultats
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {exams.filter(exam => exam.formateur.id == currentUser.id).length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun examen créé</p>
              <p className="text-gray-400">Commencez par créer votre premier examen ci-dessus</p>
            </div>
          )}
        </div>

        {/* Modal IA */}
        {showAIModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Génération IA</h3>
                <p className="text-gray-600">Laissez l'IA créer des questions pour vous</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sujet</label>
                  <input
                    type="text"
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                    placeholder="Ex: JavaScript, Python..."
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {suggestedSubjects.slice(0, 4).map((subject) => (
                      <button
                        key={subject}
                        onClick={() => setAiSubject(subject)}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de questions</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={aiNumberOfQuestions}
                    onChange={(e) => setAiNumberOfQuestions(parseInt(e.target.value))}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                  disabled={aiLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={generateWithAI}
                  disabled={aiLoading || !aiSubject.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {aiLoading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Générer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamManagement;