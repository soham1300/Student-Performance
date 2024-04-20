import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import TimelineIcon from "@mui/icons-material/Timeline";
import Typography from "@mui/material/Typography";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../DB/FirebaseConfig";
import Avatar from "@mui/material/Avatar";
import { PiStudentBold } from "react-icons/pi";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { UserContext } from "../context/UserContex";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";

function Admin({ toast }) {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDoc(doc(db, "school", currentUser.uid));
        setUserData(data.data());
        updateUser(data.data()); // Call updateUser here when userData is available
      } catch (error) {
        setError("Error getting documents: " + error.message);
      }
    };

    fetchData();
  }, [currentUser.uid, updateUser]);

  if (!userData) {
    return <div>Loading...</div>;
  }
  if (error) {
    toast.error(error);
  }

  return (
    <AdminDiv>
      <AdminSideBar>
        <WebsiteLogo>
          <TimelineIcon fontSize="large" />
          <Typography
            variant="h4"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
            }}
          >
            EduSnap
          </Typography>
        </WebsiteLogo>

        <OptionsDiv>
          <Options
            active={location.pathname === "/admin/classes"}
            onClick={() => navigate("/admin/classes")}
          >
            <SiGoogleclassroom />
            Classes
          </Options>
          <Options
            active={location.pathname === "/admin/teachers"}
            onClick={() => navigate("/admin/teachers")}
          >
            <PiChalkboardTeacherBold />
            Teachers
          </Options>
          <Options
            active={location.pathname === "/admin/students"}
            onClick={() => navigate("/admin/students")}
          >
            <PiStudentBold />
            Students
          </Options>
        </OptionsDiv>
      </AdminSideBar>
      <MainDiv>
        <AdminTopBar>
          <AdminTopBarText>Admin Dashboard</AdminTopBarText>
          <AdminSchoolDetail>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() =>
                signOut(auth)
                  .then(() => {
                    navigate("/");
                  })
                  .catch((error) => {
                    toast.error(error.message);
                  })
              }
              style={{
                margin: "0 1rem",
              }}
            >
              Logout
            </Button>
            <Avatar alt={userData.displayName} src={userData.photoURL} />
            <AdminSchoolName>{userData.displayName}</AdminSchoolName>
          </AdminSchoolDetail>
        </AdminTopBar>
        <hr />
        <AllInfoDiv>
          <Outlet userData={userData} />
        </AllInfoDiv>
      </MainDiv>
    </AdminDiv>
  );
}

export default Admin;

const AdminDiv = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const AdminSideBar = styled.div`
  width: 15%;
  height: 100%;
  background-color: #2e3b55;
  display: flex;
  flex-direction: column;
`;

const WebsiteLogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
`;

const OptionsDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const Options = styled.div`
  display: flex;
  align-items: center;

  font-size: 2rem;
  color: white;
  padding: 12px;
  margin: 20px 0;
  cursor: pointer;
  background-color: ${(props) => props.active && "#20293b"};
  border-radius: 15px;
  gap: 12px;
  &:hover {
    background-color: #20293b;
  }
`;

const MainDiv = styled.div`
  height: 100%;
  width: 100%;
`;

const AdminTopBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const AdminTopBarText = styled.p`
  font-size: 2.5rem;
  margin: 12px;
  font-weight: bold;
  color: #2e3b55;
`;

const AdminSchoolDetail = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 12px;
`;

const AdminSchoolName = styled.p`
  font-size: 2rem;
  margin: 0 12px;
  font-weight: bold;
  color: #2e3b55;
`;

const AllInfoDiv = styled.div`
  flex-grow: 1;
  overflow: auto;
  height: 92vh;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track:hover {
    background: #555;
  }
  &::-webkit-scrollbar-thumb:active {
    background: #333;
  }
`;
