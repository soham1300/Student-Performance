import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import { GiTeacher } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { PiChartScatter } from "react-icons/pi";
import { MdOutlineAssignment } from "react-icons/md";

import { DataGrid } from "@mui/x-data-grid";

function Class() {
  const { classId } = useParams();
  const [classData, setClassData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "classes", classId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setClassData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchData();
  }, [classId]);
  if (!classData) {
    return <p>Loading....</p>;
  }

  // Extract unique dates from the data
  const uniqueDates = classData.attendance
    ? [...new Set(classData.attendance.map((row) => row.date))]
    : [];

  // Create columns dynamically based on unique dates
  // Create columns dynamically based on unique dates
  // Create columns dynamically based on unique dates
  const columns = [
    { field: "rollNo", headerName: "RollNo", width: 90 },
    { field: "studentName", headerName: "Student Name", width: 150 },
    ...uniqueDates.map((date) => ({
      field: date,
      headerName: new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      width: 120,
    })),
  ];

  // Create rows with attendance data
  const rows = [];
  classData.attendance?.forEach((row, index) => {
    const existingRow = rows.find((r) => r.id === row.id);
    if (existingRow) {
      // Update existing row with attendance for the current date
      existingRow[row.date] = row.attendance;
    } else {
      // Create a new row with the student id as the unique id
      const newRow = {
        id: row.id, // Use the student id as the unique id
        rollNo: index,
        studentName: row.name,
        [row.date]: row.attendance,
      };
      rows.push(newRow);
    }
  });

  const DataTable = () => {
    return (
      <div
        style={{
          width: "86vw",
          maxHeight: "80vh",
        }}
      >
        <DataGrid rows={rows} columns={columns} />
      </div>
    );
  };

  return (
    <ClassDiv>
      <ClassNameText>
        {classData && `Class ${classData.className}`}
      </ClassNameText>
      <ClassDataBoxDiv>
        <ClassDataBox>
          <GiTeacher size={42} />
          Class Teacher
          <ClassDataBoxData>
            {classData.classTeacher ? classData.classTeacher : "-"}
          </ClassDataBoxData>
        </ClassDataBox>
        <ClassDataBox>
          <PiStudent size={42} />
          Total Students
          <ClassDataBoxData>
            {classData.students ? classData.students.length : "-"}
          </ClassDataBoxData>
        </ClassDataBox>
        <ClassDataBox>
          <PiChartScatter size={42} />
          Avg. Attendance
          <ClassDataBoxData>
            {classData.attendance ? classData.attendance.length : "-"}
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
      <AttendanceTableText>Attendance</AttendanceTableText>
      {/* <AttendanceTable data={studentAttendanceData} /> */}
      {classData.attendance && <DataTable />}
    </ClassDiv>
  );
}

export default Class;

const ClassDiv = styled.div``;

const ClassNameText = styled.p`
  margin: 0 12px;
  font-size: 3rem;
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

const AttendanceTableText = styled.p`
  margin: 0 12px;
  font-size: 3rem;
  font-weight: bold;
  color: #2e3b55;
`;
