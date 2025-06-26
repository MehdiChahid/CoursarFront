import React, { useEffect, useMemo, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Award, 
  Calendar,
  Target,
  PieChart,
  Activity,
  Download,
  AlertCircle
} from 'lucide-react';

const BarChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
          {title}
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <AlertCircle className="w-8 h-8 mr-2" />
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value)) || 1;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-32 text-sm text-gray-600 truncate">{item.label}</div>
            <div className="flex-1 mx-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="w-16 text-sm font-semibold text-gray-800">{item.value.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ data, title }) => {
  if (!data || data.length === 0 || data.every(item => item.value === 0)) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-purple-600" />
          {title}
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <AlertCircle className="w-8 h-8 mr-2" />
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const radius = 60;
  const strokeWidth = 20;
  const colors = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-purple-600" />
        {title}
      </h3>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
            />
            {data.map((item, index) => {
              if (item.value === 0) return null;
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const strokeDasharray = `${(angle / 360) * (2 * Math.PI * radius)} ${2 * Math.PI * radius}`;
              const strokeDashoffset = -((currentAngle / 360) * (2 * Math.PI * radius));
              currentAngle += angle;
              
              return (
                <circle
                  key={index}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={colors[index]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              {trendValue}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default function Rapport({ currentUser, id_etudiant }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (id_etudiant) {
        try {
          const response = await fetch(`http://localhost:8080/api/results/etudiant/${id_etudiant}`);
          if (response.ok) {
            const data = await response.json();
            setResults(data || []);
          } else {
            setResults([]);
          }
        } catch (error) {
          setResults([]);
        }
      }
    };

    fetchResults();
  }, [id_etudiant, currentUser]);

  console.log('Results:', results);

  // Traitement des vraies données basé sur results
  const processedData = useMemo(() => {
    if (!results || results.length === 0) {
      return {
        totalExams: 0,
        totalResults: 0,
        totalParticipants: 0,
        averageScore: 0,
        successRate: 0,
        examScores: [],
        gradeDistribution: [],
        recentActivity: [],
        difficultExams: [],
        allResults: []
      };
    }

    // Extraire les examens uniques depuis les résultats
    const uniqueExams = new Map();
    results.forEach(result => {
      if (result.exam && !uniqueExams.has(result.exam.id)) {
        uniqueExams.set(result.exam.id, result.exam);
      }
    });
    const exams = Array.from(uniqueExams.values());

    // Statistiques générales
    const totalExams = exams.length;
    const totalResults = results.length;
    const totalParticipants = new Set(results.map(r => r.etudiant?.id || r.id)).size;
    
    const averageScore = results.length > 0 
      ? results.reduce((sum, result) => sum + (result.score || 0), 0) / results.length 
      : 0;

    // Scores par examen
    const examScores = exams.map(exam => {
      const examResults = results.filter(result => result.exam?.id === exam.id);
      const avgScore = examResults.length > 0 
        ? examResults.reduce((sum, result) => sum + (result.score || 0), 0) / examResults.length 
        : 0;
      return {
        label: exam.title || `Examen ${exam.id}`,
        value: avgScore,
        participantsCount: examResults.length
      };
    });

    // Répartition des notes basée sur les vrais résultats
    const gradeDistribution = [
      { 
        label: 'Excellent (90-100%)', 
        value: results.filter(r => r.score >= 90).length 
      },
      { 
        label: 'Bien (70-89%)', 
        value: results.filter(r => r.score >= 70 && r.score < 90).length 
      },
      { 
        label: 'Passable (50-69%)', 
        value: results.filter(r => r.score >= 50 && r.score < 70).length 
      },
      { 
        label: 'Échec (0-49%)', 
        value: results.filter(r => r.score < 50).length 
      }
    ];

    // Taux de réussite réel
    const successRate = results.length > 0 
      ? (results.filter(r => r.score >= 50).length / results.length) * 100 
      : 0;

    // Activité par date
    const activityByDate = {};
    results.forEach(result => {
      if (result.datePassage) {
        const date = result.datePassage.split('T')[0];
        if (!activityByDate[date]) {
          activityByDate[date] = { results: 0, participants: new Set() };
        }
        activityByDate[date].results++;
        activityByDate[date].participants.add(result.etudiant?.id || result.id);
      }
    });

    const recentActivity = Object.entries(activityByDate)
      .map(([date, data]) => ({
        date,
        results: data.results,
        participants: data.participants.size
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Examens les plus difficiles (score moyen le plus bas)
    const difficultExams = examScores
      .filter(exam => exam.participantsCount > 0)
      .sort((a, b) => a.value - b.value)
      .slice(0, 5);

    // Transformer les résultats pour l'affichage
    const allResults = results.map(result => ({
      ...result,
      examId: result.exam?.id,
      examTitle: result.exam?.title,
      formateur: result.exam?.formateur,
      questionsCount: result.exam?.questions ? result.exam.questions.length : 0
    }));

    return {
      totalExams,
      totalResults,
      totalParticipants,
      averageScore,
      successRate,
      examScores: examScores.filter(exam => exam.participantsCount > 0),
      gradeDistribution,
      recentActivity,
      difficultExams,
      allResults
    };
  }, [results]);

  // Si pas de données
  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Aucun résultat disponible</h2>
            <p className="text-gray-500">Passez des examens pour voir vos rapports et statistiques.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                📊 Mes Résultats - Tableau de Bord
              </h1>
              <p className="text-gray-600">
                Analyse de vos performances et statistiques personnelles
              </p>
            </div>
            <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exporter PDF
            </button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Examens Passés"
            value={processedData.totalResults}
            icon={FileText}
            color="bg-blue-500"
          />
          <StatCard
            title="Examens Différents"
            value={processedData.totalExams}
            icon={Award}
            color="bg-green-500"
          />
          <StatCard
            title="Score Moyen"
            value={`${processedData.averageScore.toFixed(1)}%`}
            icon={Target}
            color="bg-purple-500"
          />
          <StatCard
            title="Taux de Réussite"
            value={`${processedData.successRate.toFixed(1)}%`}
            icon={Award}
            color="bg-orange-500"
          />
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart
            data={processedData.examScores}
            title="Mes Scores par Examen"
          />
          <DonutChart
            data={processedData.gradeDistribution}
            title="Répartition de Mes Notes"
          />
        </div>

        {/* Graphiques secondaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mon activité récente */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-600" />
              Mon Activité Récente
            </h3>
            {processedData.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {processedData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {activity.results} examen{activity.results > 1 ? 's passés' : ' passé'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-indigo-600">
                        {activity.results}
                      </div>
                      <div className="text-xs text-gray-500">tentative{activity.results > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="w-8 h-8 mx-auto mb-2" />
                Aucune activité récente
              </div>
            )}
          </div>

          {/* Mes examens les plus difficiles */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-600" />
              Mes Examens les Plus Difficiles
            </h3>
            {processedData.difficultExams.length > 0 ? (
              <div className="space-y-3">
                {processedData.difficultExams.map((exam, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {exam.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {exam.participantsCount} tentative{exam.participantsCount > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-red-600">
                      {exam.value.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Target className="w-8 h-8 mx-auto mb-2" />
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Tableau détaillé de mes résultats */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
              Historique Détaillé de Mes Résultats ({processedData.allResults.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Examen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mon Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedData.allResults.length > 0 ? (
                  processedData.allResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.examTitle}
                        </div>
                        <div className="text-xs text-gray-500">
                          Par {result.formateur?.name || 'Inconnu'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(result.datePassage).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(result.datePassage).toLocaleTimeString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {result.score.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          result.score >= 70 ? 'bg-green-100 text-green-800' :
                          result.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.score >= 70 ? 'Réussi' : result.score >= 50 ? 'Passable' : 'Échec'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.questionsCount} question{result.questionsCount > 1 ? 's' : ''}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      Aucun résultat disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 