import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import { AuthContext } from "../context/AuthContext";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

function Attendance() {
  const { currentUser } = useContext(AuthContext);
  const [classData, setClassData] = useState();
  // const [attendanceData, setAttendanceData] = useState({
  //   studentName: "",
  //   date: "",
  //   attendance: "Present",
  // });
  const [attendance, setAttendance] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [classId, setClassId] = useState();
  const navigate = useNavigate();

  const markAttendance = (studentName, id, status) => {
    const updatedAttendance = [...attendance];
    let today = new Date().toISOString().slice(0, 10);
    const existingIndex = updatedAttendance.findIndex(
      (item) => item.name === studentName
    );
    if (existingIndex !== -1) {
      updatedAttendance[existingIndex].attendance = status;
    } else {
      updatedAttendance.push({
        name: studentName,
        attendance: status,
        date: today,
        id: id,
      });
    }

    setAttendance(updatedAttendance);
    setAttendanceStatus({
      ...attendanceStatus,
      [studentName]: status === "Present" ? "green" : "red",
    });
  };

  const handleSendAttendance = async () => {
    await updateDoc(doc(db, "classes", classId), {
      attendance: arrayUnion(...attendance),
    });
    console.log(attendance);
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "users"),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        console.log(document.id, " => ", document.data());
        setClassId(document.data().classId);
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

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setAttendanceData({
  //     ...attendanceData,
  //     [name]: value,
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // const attendanceRef = firebase.database().ref("attendance");
  //   // attendanceRef.push(attendanceData);
  //   setAttendanceData({
  //     studentName: "",
  //     date: "",
  //     attendance: "Present",
  //   });
  // };

  // Inside the table body
  if (!classData) {
    return <p>Loading....</p>;
  }

  return (
    <AttendanceDiv>
      <Title>Student Attendance</Title>
      <hr />
      <Table>
        <thead>
          <tr>
            <Th>Index</Th>
            <Th>Name</Th>
            <Th>Attendance</Th>
          </tr>
        </thead>
        <tbody>
          {classData &&
            classData.students &&
            classData.students.map((student, index) => (
              <tr key={student.uid}>
                <Td>{index + 1}</Td>
                <Td>{student.name}</Td>
                <Td>
                  <BtnDiv>
                    <PresentBtn
                      onClick={() => {
                        markAttendance(student.name, student.uid, "Present");
                      }}
                      selected={attendanceStatus[student.name] === "green"}
                    >
                      Present
                    </PresentBtn>
                    <AbsentBtn
                      onClick={() => {
                        markAttendance(student.name, student.uid, "Absent");
                      }}
                      selected={attendanceStatus[student.name] === "red"}
                    >
                      Absent
                    </AbsentBtn>
                  </BtnDiv>
                </Td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* <p>
        {attendance.length > 0 ? (
          <ul>
            {attendance.map((item) => (
              <li key={item.id}>
                {item.name} - {item.date} - {item.attendance}
              </li>
            ))}
          </ul>
        ) : (
          "No Data"
        )}
      </p> */}
      <SendBtnDiv>
        <Button
          variant="contained"
          color="success"
          size="large"
          endIcon={<SendIcon />}
          onClick={() => handleSendAttendance()}
        >
          Save Attendance
        </Button>
      </SendBtnDiv>
    </AttendanceDiv>
  );
}

export default Attendance;

const AttendanceDiv = styled.div``;

const Title = styled.p`
  font-size: 2.5rem;
  margin: 12px;
  font-weight: bold;
  color: #2e3b55;
`;

const Table = styled.table`
  font-size: 2rem;
  margin-left: 12px;
  width: 98%;
  color: #2e3b55;
  text-align: left;
  padding: 8px;
`;

const Th = styled.th`
  padding: 8px;
  text-align: center;
  padding: 8px;
  background-color: #2e3b55;
  color: white;
`;

const Td = styled.td`
  border-collapse: collapse;
  text-align: center;
  padding: 8px;
  background-color: #e0e0e0;
`;

const BtnDiv = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-evenly;
`;

const PresentBtn = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  padding: 12px;
  cursor: pointer;
  width: 30%;
  text-align: center;
  background-color: ${(props) => (props.selected ? "#bff3bf" : "#fff")};
  &:hover {
    background-color: #bff3bf;
  }
`;

const AbsentBtn = styled(PresentBtn)`
  background-color: ${(props) => (props.selected ? "#f0acac" : "#fff")};
  &:hover {
    background-color: #f0acac;
  }
`;

const SendBtnDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  font-size: 2rem;
`;
