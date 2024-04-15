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

function TeacherDashboard() {
  const [classData, setClassData] = useState(null);
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
          classSnap.data().assignments.forEach((assignment) => {
            newAssignments[assignment.subject].push(assignment);
          });
          setAssignments(newAssignments);
        } else {
          console.log("No such document!");
        }
      });
    };
    fetchData();
  }, [currentUser.uid]);

  return (
    <TeacherDashboardDiv>
      {classData && (
        <>
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
              <TakeAtt onClick={() => navigate("/attendance")}>
                Take Attendance <KeyboardArrowRightIcon fontSize="large" />
              </TakeAtt>
            </AttendanceTop>
            <AttendanceGraph
              attendanceData={classData.attendance}
              totalStudents={classData.students ? classData.students.length : 0}
            />
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
                            <AccordionItem key={index} style={{ width: "95%" }}>
                              <AccordionItemHeading>
                                <AccordionItemButton>
                                  {assignment.title}
                                </AccordionItemButton>
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
