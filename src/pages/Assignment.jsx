import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
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
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

function Assignment({ toast }) {
  const [classData, setClassData] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState({});
  const [assignmentSubmit, setAssignmentSubmit] = useState([]);
  const [classUid, setClassUid] = useState();

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
        setClassUid(document.data().classId);
        if (classSnap.exists()) {
          console.log("Document data:", classSnap.data());
          setClassData(classSnap.data());
          for (let i = 0; i < classSnap.data().assignments.length; i++) {
            if (classSnap.data().assignments[i].title === assignmentId) {
              setAssignment(classSnap.data().assignments[i]);
              setAssignmentSubmit(classSnap.data().assignments[i].submitted);
            }
          }
        } else {
          console.log("No such document!");
        }
      });
    };
    fetchData();
  }, [currentUser.uid, assignmentId]);

  const handleChecked = (studentUid) => {
    // Add studentUid to assignmentSubmit array
    const updatedSubmitArray = [...assignmentSubmit, studentUid];
    setAssignmentSubmit(updatedSubmitArray);
  };

  const handleNotChecked = (studentUid) => {
    // Remove studentUid from assignmentSubmit array
    const updatedSubmitArray = assignmentSubmit.filter(
      (uid) => uid !== studentUid
    );
    setAssignmentSubmit(updatedSubmitArray);
  };

  const handleSendAssignmentDone = async () => {
    for (let i = 0; i < classData.assignments.length; i++) {
      if (classData.assignments[i].title === assignmentId) {
        classData.assignments[i].submitted = assignmentSubmit;
        await updateDoc(doc(db, "classes", classUid), {
          assignments: classData.assignments,
        });
      }
    }
    toast.success("Assignment Data Updated successfully!");

    // await updateDoc(doc(db, "classes", classUid), {

    //   submitted: assignmentSubmit,
    // });
  };

  if (!classData && !assignment) {
    return <p>Loading....</p>;
  }

  return (
    <AssignmentDiv>
      <RegisterTitle>
        <div>{assignment.title}</div>
        <RegisterTitleRightDiv>
          <div>Subject: {assignment.subject}</div>
          <div>Assigned Date: {assignment.dateAssigned}</div>
          <div>Due Date: {assignment.lastDate}</div>
        </RegisterTitleRightDiv>
      </RegisterTitle>
      <Table>
        <thead>
          <tr>
            <Th>Index</Th>
            <Th>Name</Th>
            <Th>Submit Online</Th>
            <Th>Assignment Checked</Th>
          </tr>
        </thead>
        <tbody>
          {classData &&
            classData.students &&
            classData.students.map((student, index) => (
              <tr key={student.uid}>
                <Td>{index + 1}</Td>
                <Td>{student.name}</Td>
                <Td></Td>
                <Td>
                  {assignmentSubmit.includes(student.uid) ? (
                    <CheckedBtn onClick={() => handleNotChecked(student.uid)}>
                      Checked
                    </CheckedBtn>
                  ) : (
                    <NotCheckedBtn onClick={() => handleChecked(student.uid)}>
                      Not Checked
                    </NotCheckedBtn>
                  )}
                </Td>
              </tr>
            ))}
        </tbody>
      </Table>
      <SendBtnDiv>
        <Button
          variant="contained"
          color="success"
          size="large"
          endIcon={<SendIcon />}
          onClick={() => handleSendAssignmentDone()}
        >
          Save Changes
        </Button>
      </SendBtnDiv>
    </AssignmentDiv>
  );
}

export default Assignment;

const AssignmentDiv = styled.div`
  width: 100vw;
  height: 100vh;
`;

const RegisterTitle = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2e3b55;
  padding: 20px;
  color: white;
`;

const RegisterTitleRightDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 100px;
  font-size: 1.5rem;
  opacity: 0.8;
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
const CheckedBtn = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  padding: 12px;
  cursor: pointer;
  width: 30%;
  text-align: center;
  background-color: #bff3bf;
  margin: auto; /* Center the button horizontally */
  &:hover {
    background-color: #bff3bf;
  }
`;

const NotCheckedBtn = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  padding: 12px;
  cursor: pointer;
  width: 30%;
  text-align: center;
  background-color: #f0acac;
  margin: auto; /* Center the button horizontally */
  &:hover {
    background-color: #bff3bf;
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
