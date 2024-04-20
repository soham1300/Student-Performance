// import logo from "./logo.svg";
import { useContext } from "react";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./pages/Admin";
import Classes from "./pages/Classes";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import { AuthContext } from "./context/AuthContext";
import Class from "./pages/Class";
import TeacherDashboard from "./pages/TeacherDashboard";
import Attendance from "./pages/Attendance";
import AddAssignment from "./pages/AddAssignment";
import ShowAttendance from "./pages/ShowAttendance";

function App() {
  const { currentUser } = useContext(AuthContext);
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <div className="App">
      <ToastContainer limit={1} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login toast={toast} />} />
        <Route path="register" element={<Register toast={toast} />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <Admin toast={toast} />
            </ProtectedRoute>
          }
        >
          <Route
            path="classes"
            element={
              <ProtectedRoute>
                <Classes toast={toast} />
              </ProtectedRoute>
            }
          />
          <Route path="class">
            <Route
              path=":classId"
              element={
                <ProtectedRoute>
                  <Class toast={toast} />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="teachers"
            element={
              <ProtectedRoute>
                <Teachers toast={toast} />
              </ProtectedRoute>
            }
          />
          <Route
            path="students"
            element={
              <ProtectedRoute>
                <Students toast={toast} />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="teacher"
          element={
            <ProtectedRoute>
              <TeacherDashboard toast={toast} />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="attendance"
          element={
            <ProtectedRoute>
              <Attendance toast={toast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="addassignment"
          element={
            <ProtectedRoute>
              <AddAssignment toast={toast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="showattendance"
          element={
            <ProtectedRoute>
              <ShowAttendance toast={toast} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
