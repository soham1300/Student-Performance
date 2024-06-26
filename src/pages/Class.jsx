import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import { GiTeacher } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { PiChartScatter } from "react-icons/pi";
import { MdOutlineAssignment } from "react-icons/md";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

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
  const columns = [
    { field: "rollNo", header: "RollNo" },
    { field: "studentName", header: "Student Name" },
    ...uniqueDates.map((date) => ({
      field: date,
      header: new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    })),
    { field: "attendancePercentage", header: "Attendance %" }, // Add this column
  ];

  // Create rows with attendance data
  let rows = [];
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
        ...uniqueDates.reduce((acc, date) => {
          acc[date] = ""; // Initialize attendance for each date
          return acc;
        }, {}),
        [row.date]: row.attendance,
      };
      rows.push(newRow);
    }
  });

  // Calculate attendance percentage for each student
  rows = rows.map((row) => {
    const totalDays = uniqueDates.length;
    const presentDays = Object.values(row).filter(
      (val) => val === "Present"
    ).length;
    const attendancePercentage = (presentDays / totalDays) * 100 || 0; // Handle division by zero
    return {
      ...row,
      attendancePercentage: attendancePercentage.toFixed(2),
    };
  });

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
            {classData.assignments ? classData.assignments.length : "-"}
          </ClassDataBoxData>
        </ClassDataBox>
      </ClassDataBoxDiv>
      <AttendanceTableText>Attendance</AttendanceTableText>
      <div className="card">
        <DataTable
          value={rows}
          scrollable
          scrollHeight="500px"
          className="p-datatable-striped"
          style={{ fontSize: "1.2rem", borderCollapse: "collapse" }}
        >
          {columns.map((col, index) => (
            <Column
              key={index}
              field={col.field}
              header={col.header}
              style={{
                width: col.field === "rollNo" ? "70px" : "auto",
                border: "1px solid #dee2e6",
                padding: "8px",
              }}
              body={(rowData) => {
                const cellValue = rowData[col.field];
                const color =
                  cellValue === "Present"
                    ? "green"
                    : cellValue === "Absent"
                    ? "red"
                    : "";
                return <span style={{ color }}>{cellValue}</span>;
              }}
            />
          ))}
        </DataTable>
      </div>
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
