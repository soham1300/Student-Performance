import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { GiTeacher } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { PiChartScatter } from "react-icons/pi";
import { MdOutlineAssignment } from "react-icons/md";
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
import AttendanceGraph from "../component/AttendanceGraph";
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

function TeacherDashboard({ toast }) {
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
            setAssignments(newAssignments);
          }
        } else {
          console.log("No such document!");
        }
      });
    };
    fetchData();
  }, [currentUser.uid]);

  // Define groupedExams object

  if (classData && classData.marks) {
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
            <Title>Teacher Dashboard</Title>
            {/* <LogoutButton onClick={() => navigate("/")}> */}
            <div>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={() => {
                  navigate("/parent-connect");
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
            </div>
          </TitleBarDiv>
          <hr />
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
          <AttendanceDiv>
            <AttendanceTop>
              <Title>Attendance</Title>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <TakeAtt onClick={() => navigate("/showattendance")}>
                  Show Attendance
                </TakeAtt>
                <TakeAtt onClick={() => navigate("/attendance")}>
                  Take Attendance <KeyboardArrowRightIcon fontSize="large" />
                </TakeAtt>
              </div>
            </AttendanceTop>
            {classData.attendance ? (
              <AttendanceGraph
                attendanceData={classData.attendance}
                totalStudents={
                  classData.students ? classData.students.length : 0
                }
              />
            ) : (
              <NoAttendDiv>No Attendance</NoAttendDiv>
            )}
          </AttendanceDiv>
          <AssignmentDiv>
            <AssignmentTop>
              <Title>Assignment</Title>
              <AddAss onClick={() => navigate("/addassignment")}>
                Add Assignment <KeyboardArrowRightIcon fontSize="large" />
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
                                <AccordionItemButton>
                                  {assignment.title}
                                </AccordionItemButton>
                              </AccordionItemHeading>
                              <AccordionItemPanel
                                onClick={() =>
                                  navigate(`/assignment/${assignment.title}`)
                                }
                              >
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
              <div>
                <TakeAtt onClick={() => navigate("/addmarks")}>
                  Add Marks <KeyboardArrowRightIcon fontSize="large" />
                </TakeAtt>
              </div>
            </AttendanceTop>
            <MarksDiv>
              {Object.keys(groupedExams)
                .sort((a, b) => new Date(b) - new Date(a))
                .map((examDate, index) => (
                  <MarksDate key={index}>
                    <ExamDate>{examDate}</ExamDate>
                    <MarksList>
                      {groupedExams[examDate].map((exam, index) => (
                        <ExamItem
                          key={index}
                          onClick={() => navigate(`/exam/${exam.examName}`)}
                        >
                          <ExamDetails>Exam: {exam.examName}</ExamDetails>
                          <ExamDetails>Subject: {exam.subject}</ExamDetails>
                        </ExamItem>
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
`;

const AssignmentData = styled.div`
  width: 90%;
  min-height: 100px;
  margin: 20px;
  border-radius: 5px;
  text-align: center;
  border: 1px solid #2e3b55;
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
`;

const ExamItem = styled.div`
  padding: 10px;
  margin: 0 0 10px 10px;
  background-color: #2e3b55;
  border-radius: 5px;
  cursor: pointer;
`;

const ExamDate = styled.p`
  font-size: 2rem;
  margin: 12px;
  font-weight: bold;
  color: #2e3b55;
`;

const ExamDetails = styled.p`
  font-size: 1.5rem;
  border-radius: 5px;
  padding: 8px;
  margin: 0;
  color: white;
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
