import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { db, auth } from "../DB/FirebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import AttendanceGraph from "../component/ParentAttendanceGraph";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";

function ParentDashboard({ toast }) {
  const [classData, setClassData] = useState({});
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState({
    English: [],
    Maths: [],
    Science: [],
    History: [],
    Geography: [],
    Hindi: [],
    Marathi: [],
  });
  const groupedExams = {};
  const [studentUid, setStudentUid] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let studentName = "";
      const q = query(
        collection(db, "users"),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        console.log(document.id, " => ", document.data());

        studentName = document.data().displayName;
        const classSnap = await getDoc(
          doc(db, "classes", document.data().classId)
        );
        if (classSnap.exists()) {
          console.log("Document data:", classSnap.data());
          setClassData(classSnap.data());
          // Move assignment processing here
          const newAssignments = {
            English: [],
            Maths: [],
            Science: [],
            History: [],
            Geography: [],
            Hindi: [],
            Marathi: [],
          };

          if (classSnap.data().assignments) {
            classSnap.data().assignments.forEach((assignment) => {
              newAssignments[assignment.subject].push(assignment);
            });
          }

          setAssignments(newAssignments);

          classSnap.data().students.forEach((student) => {
            if (student.name === studentName) {
              setStudentUid(student.uid);
            }
          });
        } else {
          console.log("No such document!");
        }
      });
    };
    fetchData();
  }, [currentUser.uid]);

  // Define groupedExams object

  if (classData.marks) {
    classData.marks.forEach((exam) => {
      if (!groupedExams[exam.examDate]) {
        groupedExams[exam.examDate] = [];
      }
      groupedExams[exam.examDate].push(exam);
    });
    // Use groupedExams to render exams
    console.log("Grouped Exams:", groupedExams);
  }

  return (
    <TeacherDashboardDiv>
      {classData && (
        <>
          <TitleBarDiv>
            <Title>Parents Dashboard</Title>
            {/* <LogoutButton onClick={() => navigate("/")}> */}
            <BtnDiv>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => {
                  navigate("/parent-parent-connect");
                }}
                style={{
                  margin: "0 1rem",
                }}
              >
                Parent Connect
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
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
            </BtnDiv>
          </TitleBarDiv>
          <hr />

          <AttendanceDiv>
            <AttendanceTop>
              <Title>Attendance</Title>
            </AttendanceTop>

            {classData.attendance ? (
              <AttendanceGraph
                attendanceData={classData.attendance}
                totalStudents={
                  classData.students ? classData.students.length : 0
                }
                studentUid={studentUid}
              />
            ) : (
              <NoAttendDiv>No Attendance</NoAttendDiv>
            )}
          </AttendanceDiv>
          <AssignmentDiv>
            <AssignmentTop>
              <Title>Assignment</Title>
              <AddAss onClick={() => navigate("/upload-assignment")}>
                Upload Assignment <KeyboardArrowRightIcon fontSize="large" />
              </AddAss>
            </AssignmentTop>
            <AssignmentDataDiv>
              {assignments &&
                Object.entries(assignments).map(
                  ([subject, assignmentsArray]) => (
                    <AssignmentData key={subject}>
                      <AssignmentDataTitle>{subject}</AssignmentDataTitle>
                      <Accordion>
                        {assignmentsArray &&
                          assignmentsArray.map((assignment, index) => (
                            <AccordionItem key={index} style={{ width: "94%" }}>
                              <AccordionItemHeading>
                                {assignment.submitted.includes(studentUid) ? (
                                  <AccordionItemButton
                                    style={{
                                      width: "100%", // Ensure the button takes full width of the item
                                      backgroundColor: "#bff3bf",
                                      "@media (max-width: 768px)": {
                                        width: "90%", // Reduce width on mobile devices
                                      },
                                    }}
                                  >
                                    {assignment.title}
                                  </AccordionItemButton>
                                ) : (
                                  <AccordionItemButton
                                    style={{
                                      width: "100%", // Ensure the button takes full width of the item
                                      backgroundColor: "#f0acac",
                                      "@media (max-width: 768px)": {
                                        width: "90%", // Reduce width on mobile devices
                                      },
                                    }}
                                  >
                                    {assignment.title}
                                  </AccordionItemButton>
                                )}
                              </AccordionItemHeading>
                              <AccordionItemPanel>
                                <p>{assignment.assignment}</p>
                              </AccordionItemPanel>
                            </AccordionItem>
                          ))}
                      </Accordion>
                    </AssignmentData>
                  )
                )}
            </AssignmentDataDiv>
          </AssignmentDiv>
          <MarksDiv>
            <AttendanceTop>
              <Title>Students Marks</Title>
            </AttendanceTop>
            <MarksDiv>
              {Object.keys(groupedExams)
                .sort((a, b) => new Date(b) - new Date(a))
                .map((examDate, index) => (
                  <MarksDate key={index}>
                    <ExamDate>{examDate}</ExamDate>
                    <MarksList>
                      {groupedExams[examDate].map((exam, index) => (
                        <ExamItemContainer key={index}>
                          <ExamName>{exam.examName}</ExamName>
                          <ExamDetails>Subject: {exam.subject}</ExamDetails>
                          <ExamDetails>
                            Total Marks: {exam.totalMarks}
                          </ExamDetails>
                          {exam.marksObtained &&
                          exam.marksObtained[studentUid] ? (
                            <ExamDetails>
                              Marks Obtained: {exam.marksObtained[studentUid]}
                            </ExamDetails>
                          ) : (
                            <ExamDetails>Marks Obtained: N/A</ExamDetails>
                          )}
                        </ExamItemContainer>
                      ))}
                    </MarksList>
                  </MarksDate>
                ))}
            </MarksDiv>
          </MarksDiv>
        </>
      )}
    </TeacherDashboardDiv>
  );
}

export default ParentDashboard;

const TeacherDashboardDiv = styled.div``;

const Title = styled.p`
  font-size: 2.5rem;
  margin: 12px;
  font-weight: bold;
  color: #2e3b55;
  @media only screen and (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

// const ClassDataBoxDiv = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: space-around;
//   margin: 15px 0;
// `;

// const ClassDataBox = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   background-color: #2e3b55;
//   border-radius: 5px;
//   width: 20%;
//   color: white;
// `;

// const ClassDataBoxData = styled.p`
//   margin: 0;
//   font-size: 1.5rem;
//   font-weight: bold;
// `;

const AttendanceDiv = styled.div``;

const AttendanceTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const TakeAtt = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-right: 12px;
  padding: 0px 12px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const AssignmentDiv = styled.div``;

const AssignmentTop = styled(AttendanceTop)``;

const AddAss = styled(TakeAtt)``;

const AssignmentDataDiv = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto auto auto;
  @media only screen and (max-width: 600px) {
    grid-template-columns: auto;
  }
`;

const AssignmentData = styled.div`
  width: 90%;
  min-height: 100px;
  margin: 20px;
  border-radius: 5px;
  text-align: center;
  border: 1px solid #2e3b55;
  background-color: #f0f0f0;
`;

const AssignmentDataTitle = styled.div`
  width: 100%;
  color: white;
  background-color: #2e3b55;
  padding: 12px 0;
  font-weight: bold;
  /* border-radius: 5px 0 0 5px; */
`;

const TitleBarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const MarksDiv = styled.div`
  margin-top: 20px;
`;

const MarksDate = styled.div`
  margin-top: 20px;
`;

const MarksList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const ExamItem = styled.div`
  padding: 10px;
  margin: 0 0 10px 10px;
  background-color: #2e3b55;
  border-radius: 5px;
  cursor: pointer;
`;

const ExamItemContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin: 0 0 10px 10px;
  background-color: #2e3b55;
  color: white;
`;

const ExamName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ExamDetails = styled.div`
  margin-bottom: 5px;
`;
const ExamDate = styled.p`
  font-size: 1.3rem;
  margin: 12px;
  font-weight: bold;
  color: #2e3b55;
`;

// const ExamDetails = styled.p`
//   font-size: 1.1rem;
//   border-radius: 5px;
//   padding: 8px;
//   margin: 0;
//   color: white;
// `;

const BtnDiv = styled.div`
  display: flex;
`;

const NoAttendDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 15px 0;
  color: #2e3b55;
  font-size: 1.5rem;
  font-weight: bold;
  background-color: white;
  border-radius: 5px;
`;
