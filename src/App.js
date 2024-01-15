// import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./pages/Admin";

function App() {
  return (
    <div className="App">
      <ToastContainer limit={1} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login toast={toast} />} />
        <Route path="register" element={<Register toast={toast} />} />
        <Route path="admin" element={<Admin toast={toast} />} />
      </Routes>
    </div>
  );
}

export default App;
