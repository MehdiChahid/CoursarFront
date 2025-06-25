import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import UserManagement from "./components/UserManagement";
import ExamManagement from "./components/ExamManagement";
import AvailableExams from "./components/AvailableExams";
import ExamTaking from "./components/ExamTaking";
import StudentResults from "./components/StudentResults";
import Rapport from "./components/Rapport";

// Composant principal
const App = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  useEffect(() => {
    // Vérifie si l'utilisateur connecté est admin avant de fetch les users et les examens
    if (currentUser && currentUser.role === "admin") {
      const fetchUsers = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/users/all");
          if (response.ok) {
            const data = await response.json();
            setUsers(data.users || []);
          } else {
            setUsers([]);
          }
        } catch (error) {
          setUsers([]);
        }
      };
      fetchUsers();
    } else if (currentUser && currentUser.role == "formateur") {
      const fetchUsers = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/api/users/allstudents"
          );
          if (response.ok) {
            const data = await response.json();
            setUsers(data.users || []);
          } else {
            setUsers([]);
          }
        } catch (error) {
          setUsers([]);
        }
      };
      fetchUsers();
    }




    const fetchExams = async () => {
      if (currentUser && currentUser.role == "etudiant") {
        fetch("http://localhost:8080/api/exams")
          .then((res) => res.json())
          .then((data) =>
            setExams(data)
          )
          .catch(() => setExams([]));
      } else {
        fetch("http://localhost:8080/api/exams")
          .then((res) => res.json())
          .then((data) =>
            setExams(data.filter((exam) => exam.formateur.id == currentUser.id))
          )
          .catch(() => setExams([]));
      }
    };

    const fetchResults = async () => {
      if (currentUser && currentUser.role == "etudiant") {
        try {
          const response = await fetch(`http://localhost:8080/api/results/etudiant/${currentUser.id}`);
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

    fetchExams();
    fetchResults();
  }, [currentUser]);
  


  const [currentExam, setCurrentExam] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setActiveTab("dashboard");
  };

  const handleAddUser = (newUser) => {
    const userWithId = { ...newUser, id: Date.now() };
    setUsers((prev) => [...prev, userWithId]);
  };

  const handleAddExam = (newExam) => {
    const examWithId = {
      ...newExam,
      id: Date.now(),
      formateurId: currentUser.id,
    };
    setExams((prev) => [...prev, examWithId]);
  };

  const handleStartExam = (exam) => {
    setCurrentExam(exam);
    setActiveTab("exam");
  };

  const handleSubmitExam = (examData) => {
    const result = {
      id: Date.now(),
      exam: {id:currentExam.id},
      etudiant: {id:currentUser.id},
      answers: examData.answers,
      score: examData.score,
      date_passage: new Date().toISOString(),
    };
    setResults((prev) => [...prev, result]);
    setCurrentExam(null);
    setActiveTab("results");
  };

  const handleCancelExam = () => {
    setCurrentExam(null);
    setActiveTab("available-exams");
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Navigation
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {activeTab === "dashboard" && (
          <Dashboard users={users} exams={exams} results={results} />
        )}

        {activeTab === "users" && currentUser.role === "admin" && (
          <UserManagement setActiveTab={setActiveTab} users={users} onAddUser={handleAddUser} />
        )}

        {activeTab === "exams" && currentUser.role === "formateur" && (
          <ExamManagement
            currentUser={currentUser}
            exams={exams}
            results={results}
            onAddExam={handleAddExam}
          />
        )}

        {activeTab === "available-exams" && currentUser.role === "etudiant" && (
          <AvailableExams
            exams={exams}
            results={results}
            currentUser={currentUser}
            onStartExam={handleStartExam}
          />
        )}

        {activeTab === "exam" && currentExam && (
          <ExamTaking
            currentExam={currentExam}
            onSubmitExam={handleSubmitExam}
            onCancel={handleCancelExam}
            currentUser={currentUser}

          />
        )}

        {activeTab === "results" && currentUser.role === "etudiant" && (
          <StudentResults
            results={results}
            exams={exams}
            currentUser={currentUser}
          />
        )}

         {activeTab == "rapport" && (
          <Rapport
            results={results}
            exams={exams}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default App;
