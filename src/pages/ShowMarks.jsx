import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
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

function ShowMarks() {
  const { examName } = useParams();
  const { currentUser } = useContext(AuthContext);

  const [classData, setClassData] = useState(null);
  const [examData, setExamData] = useState(null);

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
          const foundExam =
            classSnap.data().marks &&
            classSnap.data().marks.find((exam) => exam.examName === examName);
          if (foundExam) {
            setExamData(foundExam);
          } else {
            // Handle case where exam with given name is not found
          }
        } else {
          console.log("No such document!");
        }
      });
    };
    fetchData();
  }, [currentUser.uid, examName]);

  if (!classData || examData === null) return <p>Loading...</p>;

  return (
    <ShowMarksDiv>
      <RegisterTitle>
        <div>{examData.examName}</div>

        <RegisterTitleRightDiv>
          <div>Subject: {examData.subject}</div>
          <div>Exam Date: {examData.examDate}</div>
        </RegisterTitleRightDiv>
      </RegisterTitle>
      <Table>
        <thead>
          <tr>
            <Th>Index</Th>
            <Th>Name</Th>
            <Th>Marks Obtained</Th>
            <Th>Maximum Marks</Th>
          </tr>
        </thead>
        <tbody>
          {examData &&
            Object.entries(examData.marksObtained).map(
              ([studentUid, marks], index) => {
                const student = classData.students.find(
                  (student) => student.uid === studentUid
                );
                return (
                  <tr key={studentUid + index}>
                    <Td>{index + 1}</Td>
                    <Td>{student ? student.name : "Unknown"}</Td>
                    <Td>{marks}</Td>
                    <Td>{examData.totalMarks}</Td>
                  </tr>
                );
              }
            )}
        </tbody>
      </Table>
    </ShowMarksDiv>
  );
}

export default ShowMarks;
const ShowMarksDiv = styled.div``;

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
