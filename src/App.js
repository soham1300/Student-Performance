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
import Assignment from "./pages/Assignment";
import AddMarks from "./pages/AddMarks";
import ShowMarks from "./pages/ShowMarks";
import Chatting from "./pages/Chatting";
import ParentDashboard from "./pages/ParentDashboard";
import ParentChatting from "./pages/ParentChatting";
import UploadAssignment from "./pages/UploadAssignment";

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
        <Route
          path="addmarks"
          element={
            <ProtectedRoute>
              <AddMarks toast={toast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="parent-connect"
          element={
            <ProtectedRoute>
              <Chatting toast={toast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="parent-parent-connect"
          element={
            <ProtectedRoute>
              <ParentChatting toast={toast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="upload-assignment"
          element={
            <ProtectedRoute>
              <UploadAssignment toast={toast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="parent-dashboard"
          element={
            <ProtectedRoute>
              <ParentDashboard toast={toast} />
            </ProtectedRoute>
          }
        />

        <Route path="assignment">
          <Route
            path=":assignmentId"
            element={
              <ProtectedRoute>
                <Assignment toast={toast} />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="exam">
          <Route
            path=":examName"
            element={
              <ProtectedRoute>
                <ShowMarks toast={toast} />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
