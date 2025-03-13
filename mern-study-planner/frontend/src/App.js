import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Dashboard from "./components/dashboard";
import CreateTask from "./components/create_task";
import Profile from './components/profile'; // Profile component correctly imported
import "./planner.css";
import ChatInterface from "./components/chat";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/profile")}>Profile</button>
      <button onClick={() => navigate("/tasks")}>Tasks</button> {/* Changed "/assignments" to "/tasks" */}
      <button onClick={() => navigate("/chat")}>EDUBOT</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            {/* Redirect root path to /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Dashboard with welcome message */}
            <Route path="/dashboard" element={<DashboardWithWelcome />} />
            
            {/* Updated Task Route to match backend API */}
            <Route path="/tasks" element={<CreateTask />} />

            {/* Profile Route */}
            <Route path="/profile" element={<Profile />} />

            {/* Chat Interface */}
            <Route path="/chat" element={<ChatInterface />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// Dashboard with Welcome Message
function DashboardWithWelcome() {
  return (
    <div>
      <h1>Welcome to Study Planner - Admin</h1>
      <Dashboard />
    </div>
  );
}

export default App;
