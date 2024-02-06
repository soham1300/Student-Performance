import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import { GiTeacher } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { PiChartScatter } from "react-icons/pi";
import { MdOutlineAssignment } from "react-icons/md";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
  const studentAttendanceData = [
    {
      id: 1,
      studentName: "Student 1 Doe",
      date: "2024-01-17",
      attendance: "Present",
    },
    {
      id: 1,
      studentName: "Student 1 Doe",
      date: "2024-01-31",
      attendance: "Present",
    },
    {
      id: 1,
      studentName: "Student 1 Doe",
      date: "2024-01-31",
      attendance: "Present",
    },
    {
      id: 1,
      studentName: "Student 1 Doe",
      date: "2024-01-16",
      attendance: "Present",
    },
    {
      id: 2,
      studentName: "Student 2 Doe",
      date: "2024-01-02",
      attendance: "Present",
    },
    {
      id: 2,
      studentName: "Student 2 Doe",
      date: "2024-01-25",
      attendance: "Absent",
    },
    {
      id: 2,
      studentName: "Student 2 Doe",
      date: "2024-01-29",
      attendance: "Present",
    },
    {
      id: 2,
      studentName: "Student 2 Doe",
      date: "2024-01-13",
      attendance: "Present",
    },
    {
      id: 3,
      studentName: "Student 3 Doe",
      date: "2024-01-31",
      attendance: "Present",
    },
    {
      id: 3,
      studentName: "Student 3 Doe",
      date: "2024-01-15",
      attendance: "Absent",
    },
    {
      id: 3,
      studentName: "Student 3 Doe",
      date: "2024-01-10",
      attendance: "Present",
    },
    {
      id: 3,
      studentName: "Student 3 Doe",
      date: "2024-01-04",
      attendance: "Present",
    },
    {
      id: 4,
      studentName: "Student 4 Doe",
      date: "2024-01-24",
      attendance: "Absent",
    },
    {
      id: 4,
      studentName: "Student 4 Doe",
      date: "2024-01-23",
      attendance: "Absent",
    },
    {
      id: 4,
      studentName: "Student 4 Doe",
      date: "2024-01-29",
      attendance: "Present",
    },
    {
      id: 4,
      studentName: "Student 4 Doe",
      date: "2024-01-10",
      attendance: "Present",
    },
    {
      id: 5,
      studentName: "Student 5 Doe",
      date: "2024-01-30",
      attendance: "Present",
    },
    {
      id: 5,
      studentName: "Student 5 Doe",
      date: "2024-01-09",
      attendance: "Present",
    },
    {
      id: 5,
      studentName: "Student 5 Doe",
      date: "2024-01-08",
      attendance: "Present",
    },
    {
      id: 5,
      studentName: "Student 5 Doe",
      date: "2024-01-15",
      attendance: "Present",
    },
    {
      id: 6,
      studentName: "Student 6 Doe",
      date: "2024-01-07",
      attendance: "Present",
    },
    {
      id: 6,
      studentName: "Student 6 Doe",
      date: "2024-01-25",
      attendance: "Present",
    },
    {
      id: 6,
      studentName: "Student 6 Doe",
      date: "2024-01-21",
      attendance: "Present",
    },
    {
      id: 6,
      studentName: "Student 6 Doe",
      date: "2024-01-11",
      attendance: "Present",
    },
    {
      id: 7,
      studentName: "Student 7 Doe",
      date: "2024-01-21",
      attendance: "Present",
    },
    {
      id: 7,
      studentName: "Student 7 Doe",
      date: "2024-01-11",
      attendance: "Present",
    },
    {
      id: 7,
      studentName: "Student 7 Doe",
      date: "2024-01-16",
      attendance: "Present",
    },
    {
      id: 7,
      studentName: "Student 7 Doe",
      date: "2024-01-21",
      attendance: "Present",
    },
    {
      id: 8,
      studentName: "Student 8 Doe",
      date: "2024-01-09",
      attendance: "Present",
    },
    {
      id: 8,
      studentName: "Student 8 Doe",
      date: "2024-01-09",
      attendance: "Present",
    },
    {
      id: 8,
      studentName: "Student 8 Doe",
      date: "2024-01-03",
      attendance: "Present",
    },
    {
      id: 8,
      studentName: "Student 8 Doe",
      date: "2024-01-23",
      attendance: "Present",
    },
    {
      id: 9,
      studentName: "Student 9 Doe",
      date: "2024-01-07",
      attendance: "Present",
    },
    {
      id: 9,
      studentName: "Student 9 Doe",
      date: "2024-01-25",
      attendance: "Present",
    },
    {
      id: 9,
      studentName: "Student 9 Doe",
      date: "2024-01-25",
      attendance: "Present",
    },
    {
      id: 9,
      studentName: "Student 9 Doe",
      date: "2024-01-06",
      attendance: "Present",
    },
    {
      id: 10,
      studentName: "Student 10 Doe",
      date: "2024-01-08",
      attendance: "Absent",
    },
    {
      id: 10,
      studentName: "Student 10 Doe",
      date: "2024-01-15",
      attendance: "Present",
    },
    {
      id: 10,
      studentName: "Student 10 Doe",
      date: "2024-01-25",
      attendance: "Present",
    },
    {
      id: 10,
      studentName: "Student 10 Doe",
      date: "2024-01-22",
      attendance: "Present",
    },
    {
      id: 11,
      studentName: "Student 11 Doe",
      date: "2024-01-23",
      attendance: "Present",
    },
    {
      id: 11,
      studentName: "Student 11 Doe",
      date: "2024-01-30",
      attendance: "Present",
    },
    {
      id: 11,
      studentName: "Student 11 Doe",
      date: "2024-01-25",
      attendance: "Present",
    },
    {
      id: 11,
      studentName: "Student 11 Doe",
      date: "2024-01-24",
      attendance: "Present",
    },
    {
      id: 12,
      studentName: "Student 12 Doe",
      date: "2024-01-29",
      attendance: "Present",
    },
    {
      id: 12,
      studentName: "Student 12 Doe",
      date: "2024-01-29",
      attendance: "Present",
    },
    {
      id: 12,
      studentName: "Student 12 Doe",
      date: "2024-01-17",
      attendance: "Present",
    },
    {
      id: 12,
      studentName: "Student 12 Doe",
      date: "2024-01-23",
      attendance: "Present",
    },
    {
      id: 13,
      studentName: "Student 13 Doe",
      date: "2024-01-11",
      attendance: "Absent",
    },
    {
      id: 13,
      studentName: "Student 13 Doe",
      date: "2024-01-03",
      attendance: "Present",
    },
    {
      id: 13,
      studentName: "Student 13 Doe",
      date: "2024-01-05",
      attendance: "Present",
    },
    {
      id: 13,
      studentName: "Student 13 Doe",
      date: "2024-01-22",
      attendance: "Absent",
    },
    {
      id: 14,
      studentName: "Student 14 Doe",
      date: "2024-01-19",
      attendance: "Present",
    },
    {
      id: 14,
      studentName: "Student 14 Doe",
      date: "2024-01-12",
      attendance: "Absent",
    },
    {
      id: 14,
      studentName: "Student 14 Doe",
      date: "2024-01-29",
      attendance: "Present",
    },
    {
      id: 14,
      studentName: "Student 14 Doe",
      date: "2024-01-30",
      attendance: "Present",
    },
    {
      id: 15,
      studentName: "Student 15 Doe",
      date: "2024-01-22",
      attendance: "Present",
    },
    {
      id: 15,
      studentName: "Student 15 Doe",
      date: "2024-01-02",
      attendance: "Present",
    },
    {
      id: 15,
      studentName: "Student 15 Doe",
      date: "2024-01-29",
      attendance: "Absent",
    },
    {
      id: 15,
      studentName: "Student 15 Doe",
      date: "2024-01-17",
      attendance: "Present",
    },
    {
      id: 16,
      studentName: "Student 16 Doe",
      date: "2024-01-20",
      attendance: "Present",
    },
    {
      id: 16,
      studentName: "Student 16 Doe",
      date: "2024-01-05",
      attendance: "Present",
    },
    {
      id: 16,
      studentName: "Student 16 Doe",
      date: "2024-01-22",
      attendance: "Absent",
    },
    {
      id: 16,
      studentName: "Student 16 Doe",
      date: "2024-01-16",
      attendance: "Present",
    },
    {
      id: 17,
      studentName: "Student 17 Doe",
      date: "2024-01-05",
      attendance: "Present",
    },
    {
      id: 17,
      studentName: "Student 17 Doe",
      date: "2024-01-21",
      attendance: "Present",
    },
    {
      id: 17,
      studentName: "Student 17 Doe",
      date: "2024-01-06",
      attendance: "Present",
    },
    {
      id: 17,
      studentName: "Student 17 Doe",
      date: "2024-01-28",
      attendance: "Present",
    },
    {
      id: 18,
      studentName: "Student 18 Doe",
      date: "2024-01-13",
      attendance: "Present",
    },
    {
      id: 18,
      studentName: "Student 18 Doe",
      date: "2024-01-13",
      attendance: "Absent",
    },
    {
      id: 18,
      studentName: "Student 18 Doe",
      date: "2024-01-11",
      attendance: "Present",
    },
    {
      id: 18,
      studentName: "Student 18 Doe",
      date: "2024-01-05",
      attendance: "Present",
    },
    {
      id: 19,
      studentName: "Student 19 Doe",
      date: "2024-01-08",
      attendance: "Absent",
    },
    {
      id: 19,
      studentName: "Student 19 Doe",
      date: "2024-01-17",
      attendance: "Present",
    },
    {
      id: 19,
      studentName: "Student 19 Doe",
      date: "2024-01-09",
      attendance: "Present",
    },
    {
      id: 19,
      studentName: "Student 19 Doe",
      date: "2024-01-07",
      attendance: "Present",
    },
    {
      id: 20,
      studentName: "Student 20 Doe",
      date: "2024-01-25",
      attendance: "Absent",
    },
    {
      id: 20,
      studentName: "Student 20 Doe",
      date: "2024-01-05",
      attendance: "Present",
    },
    {
      id: 20,
      studentName: "Student 20 Doe",
      date: "2024-01-26",
      attendance: "Present",
    },
    {
      id: 20,
      studentName: "Student 20 Doe",
      date: "2024-01-09",
      attendance: "Absent",
    },
    {
      id: 21,
      studentName: "Student 21 Doe",
      date: "2024-01-23",
      attendance: "Present",
    },
    {
      id: 21,
      studentName: "Student 21 Doe",
      date: "2024-01-23",
      attendance: "Present",
    },
    {
      id: 21,
      studentName: "Student 21 Doe",
      date: "2024-01-26",
      attendance: "Absent",
    },
    {
      id: 21,
      studentName: "Student 21 Doe",
      date: "2024-01-20",
      attendance: "Present",
    },
    {
      id: 22,
      studentName: "Student 22 Doe",
      date: "2024-01-09",
      attendance: "Absent",
    },
    {
      id: 22,
      studentName: "Student 22 Doe",
      date: "2024-01-26",
      attendance: "Present",
    },
    {
      id: 22,
      studentName: "Student 22 Doe",
      date: "2024-01-19",
      attendance: "Absent",
    },
    {
      id: 22,
      studentName: "Student 22 Doe",
      date: "2024-01-07",
      attendance: "Present",
    },
    {
      id: 23,
      studentName: "Student 23 Doe",
      date: "2024-01-01",
      attendance: "Absent",
    },
    {
      id: 23,
      studentName: "Student 23 Doe",
      date: "2024-01-26",
      attendance: "Present",
    },
    {
      id: 23,
      studentName: "Student 23 Doe",
      date: "2024-01-10",
      attendance: "Present",
    },
    {
      id: 23,
      studentName: "Student 23 Doe",
      date: "2024-01-12",
      attendance: "Absent",
    },
    {
      id: 24,
      studentName: "Student 24 Doe",
      date: "2024-01-14",
      attendance: "Present",
    },
    {
      id: 24,
      studentName: "Student 24 Doe",
      date: "2024-01-12",
      attendance: "Present",
    },
    {
      id: 24,
      studentName: "Student 24 Doe",
      date: "2024-01-09",
      attendance: "Absent",
    },
    {
      id: 24,
      studentName: "Student 24 Doe",
      date: "2024-01-29",
      attendance: "Present",
    },
    {
      id: 25,
      studentName: "Student 25 Doe",
      date: "2024-01-11",
      attendance: "Present",
    },
    {
      id: 25,
      studentName: "Student 25 Doe",
      date: "2024-01-27",
      attendance: "Present",
    },
    {
      id: 25,
      studentName: "Student 25 Doe",
      date: "2024-01-03",
      attendance: "Present",
    },
    {
      id: 25,
      studentName: "Student 25 Doe",
      date: "2024-01-02",
      attendance: "Present",
    },
  ];

  // Extract unique dates from the data
  const uniqueDates = [
    ...new Set(studentAttendanceData.map((row) => row.date)),
  ];

  // Create columns dynamically based on unique dates
  const columns = [
    { field: "id", headerName: "Roll no.", width: 70 },
    { field: "studentName", headerName: "Student Name", width: 130 },
    ...uniqueDates.map((date) => ({
      field: date,
      headerName: date,
      width: 120,
    })),
  ];

  // Create rows with attendance data
  const rows = studentAttendanceData.reduce((acc, row) => {
    const existingRow = acc.find((r) => r.id === row.id);
    if (existingRow) {
      existingRow[row.date] = row.attendance;
    } else {
      const newRow = {
        id: row.id,
        studentName: row.studentName,
        [row.date]: row.attendance,
      };
      acc.push(newRow);
    }
    return acc;
  }, []);

  const DataTable = () => {
    return (
      <div style={{ width: "86vw" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    );
  };

  if (!classData) {
    return <p>Loading....</p>;
  }

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
            {classData.students ? classData.students : "-"}
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
      <AttendanceTableText>Attendance</AttendanceTableText>
      {/* <AttendanceTable data={studentAttendanceData} /> */}
      <DataTable />
    </ClassDiv>
  );
}

// const AttendanceTable = ({ data }) => {
//   // Combine attendance information for each unique student ID
//   const aggregatedData = data.reduce((acc, row) => {
//     if (!acc[row.id]) {
//       acc[row.id] = {
//         id: row.id,
//         studentName: row.studentName,
//         attendanceByDate: {},
//       };
//     }
//     acc[row.id].attendanceByDate[row.date] = row.attendance;
//     return acc;
//   }, {});

//   // Extract unique dates from the data
//   const uniqueDates = [...new Set(data.map((row) => row.date))];

//   return (
//     <TableContainer
//       component={Paper}
//       style={{ maxHeight: "500px", width: "87%", overflowY: "auto" }}
//     >
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Student Name</TableCell>
//             {uniqueDates.map((date) => (
//               <TableCell key={date} align="center">
//                 {date}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {Object.values(aggregatedData).map((student) => (
//             <TableRow key={student.id}>
//               <TableCell>{student.studentName}</TableCell>
//               {uniqueDates.map((date) => (
//                 <TableCell key={date} align="center">
//                   {student.attendanceByDate[date] || "-"}
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

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
