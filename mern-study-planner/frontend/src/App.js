import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Dashboard from "./components/dashboard";
import CreateTask from "./components/create_task";
import Profile from "./components/profile"; 
import "./planner.css";
import ChatInterface from "./components/chat";

function Sidebar() {
  const navigate = useNavigate(); // Use React Router for navigation

  return (
    <div className="sidebar">
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/profile")}>Profile</button>
      <button onClick={() => navigate("/assignments")}>Tasks</button>
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
            {/* Redirect the default path `/` to `/dashboard` */}
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Dashboard with welcome message */}
            <Route path="/dashboard" element={<DashboardWithWelcome />} />
            <Route path="/assignments" element={<CreateTask />} />
            <Route path="/profile" element={<Profile />} />
            <Route exact path="/chat" element={<ChatInterface />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// Function to add Welcome Message to Dashboard
function DashboardWithWelcome() {
  return (
    <div>
      <h1>Welcome to Study Planner - Admin</h1>
      <Dashboard />
    </div>
  );
}

export default App;
