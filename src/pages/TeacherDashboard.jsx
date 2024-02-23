import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { GiTeacher } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { PiChartScatter } from "react-icons/pi";
import { MdOutlineAssignment } from "react-icons/md";
import { db } from "../DB/FirebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

function TeacherDashboard() {
  const [classData, setClassData] = useState();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "users"),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        console.log(document.id, " => ", document.data());
        const classSnap = await getDoc(
          doc(db, "classes", document.data().classId)
        );
        if (classSnap.exists()) {
          console.log("Document data:", classSnap.data());
          setClassData(classSnap.data());
        } else {
          console.log("No such document!");
        }
      });
    };
    fetchData();
  }, [currentUser.uid]);
  if (!classData) {
    return <div>Loading...</div>;
  }
  return (
    <TeacherDashboardDiv>
      <Title>Teacher Dashboard</Title> <hr />
      <ClassDataBoxDiv>
        <ClassDataBox>
          <GiTeacher size={42} />
          Class
          <ClassDataBoxData>
            {classData.className ? classData.className : "-"}
          </ClassDataBoxData>
        </ClassDataBox>
        <ClassDataBox>
          <PiStudent size={42} />
          Total Students
          <ClassDataBoxData>
            {classData.students ? classData.students.length() : "-"}
          </ClassDataBoxData>
        </ClassDataBox>
        <ClassDataBox>
          <PiChartScatter size={42} />
          Avg. Attendance
          <ClassDataBoxData>
            {classData.Attendance ? classData.Attendance : "-"}
          </ClassDataBoxData>
        </ClassDataBox>
        <ClassDataBox>
          <MdOutlineAssignment size={42} />
          Assignments
          <ClassDataBoxData>
            {classData.assignments ? classData.assignments : "-"}
          </ClassDataBoxData>
        </ClassDataBox>
      </ClassDataBoxDiv>
    </TeacherDashboardDiv>
  );
}

export default TeacherDashboard;

const TeacherDashboardDiv = styled.div``;

const Title = styled.p`
  font-size: 2.5rem;
  margin: 12px;
  font-weight: bold;
  color: #2e3b55;
`;

const ClassDataBoxDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 15px 0;
`;

const ClassDataBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #2e3b55;
  border-radius: 5px;
  width: 20%;
  color: white;
`;

const ClassDataBoxData = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
`;
