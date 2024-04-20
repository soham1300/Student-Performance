import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { db } from "../DB/FirebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function ShowAttendance() {
  const { currentUser } = useContext(AuthContext);
  const [classData, setClassData] = useState();

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
    <ShowAttendanceDiv>
      <Title>Student Attendance</Title>
      <hr />
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
    </ShowAttendanceDiv>
  );
}

export default ShowAttendance;

const ShowAttendanceDiv = styled.div``;

const Title = styled.p`
  font-size: 2.5rem;
  margin: 12px;
  font-weight: bold;
  color: #2e3b55;
`;
