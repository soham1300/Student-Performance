import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  doc,
  updateDoc,
  setDoc,
  getDoc,
  serverTimestamp,
  arrayUnion,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { UserContext } from "../context/UserContex";
import { db, auth } from "../DB/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

function Students({ toast }) {
  const [addStudent, setAddStudent] = useState(false);
  const [classesAvailable, setClassesAvailable] = useState(false);
  const { userData } = useContext(UserContext);
  const { currentUser } = useContext(AuthContext);
  const [studentName, setStudentName] = useState();
  const [studentClass, setStudentClass] = useState();
  const [studentLoginEmail, setStudentLoginEmail] = useState();
  const [studentLoginPassword, setStudentLoginPassword] = useState();
  const [student, setStudent] = useState([]);

  // const handleClick = async () => {
  //   const classPresent = userData.classes.some(
  //     (cls) => cls.className === studentClass
  //   );
  //   console.log(classPresent);
  //   if (classPresent) {
  //     userData.classes.map(async (cls) => {
  //       if (cls.className === studentClass) {
  //         Register(cls.id, cls.className);
  //       }
  //     });
  //   } else {
  //     toast.error("Class Not Available");
  //   }
  // };

  const handleClick = async () => {
    const classPresent = userData.classes.some(
      (cls) => cls.className === studentClass
    );
    console.log(classPresent);
    if (classPresent) {
      userData.classes.map(async (cls) => {
        if (cls.className === studentClass) {
          Register(cls.id, cls.className);
        }
      });
    } else {
      toast.error("Class Not Available");
    }
  };

  // const Register = (clsId, className) => {
  //   createUserWithEmailAndPassword(
  //     auth,
  //     studentLoginEmail,
  //     studentLoginPassword
  //   )
  //     .then(async (userCredential) => {
  //       const user = userCredential.user;
  //       await setDoc(doc(db, "users", user.uid), {
  //         uid: user.uid,
  //         displayName: studentName,
  //         classId: clsId,
  //         class: className,
  //         loginEmail: studentLoginEmail,
  //         timestamp: serverTimestamp(),
  //         type: "student",
  //       });
  //       await updateDoc(doc(db, "school", currentUser.uid), {
  //         students: arrayUnion({ name: studentName, uid: user.uid }),
  //       });
  //       await updateDoc(doc(db, "classes", clsId), {
  //         students: arrayUnion({ name: studentName, uid: user.uid }),
  //       });
  //       // navigate("/login");
  //     })
  //     .catch((error) => {
  //       const errorMessage = error.message;
  //       toast.error(errorMessage);
  //       // ..
  //     });
  // };

  const Register = async (clsId, className) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        displayName: studentName,
        classId: clsId,
        class: className,
        loginEmail: studentLoginEmail,
        timestamp: serverTimestamp(),
        type: "student",
      });
      await updateDoc(doc(db, "school", currentUser.uid), {
        students: arrayUnion({ name: studentName, uid: docRef.id }),
      });
      await updateDoc(doc(db, "classes", clsId), {
        students: arrayUnion({ name: studentName, uid: docRef.id }),
      });
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser.uid) {
          const schoolData = await getDoc(doc(db, "school", currentUser.uid));
          console.log(schoolData.data());

          if (schoolData.exists()) {
            const newStudentssArray = await Promise.all(
              schoolData.data().students.map(async (student) => {
                const docData = await getDoc(doc(db, "users", student.uid));
                return docData.data();
              })
            );

            setStudent(newStudentssArray); // Update the state directly
            setClassesAvailable(true);

            const unsub = onSnapshot(
              doc(db, "school", currentUser.uid),
              async (schoolDoc) => {
                const newStudentssArray = await Promise.all(
                  schoolDoc.data().students.map(async (students) => {
                    const docData = await getDoc(
                      doc(db, "users", students.uid)
                    );
                    return docData.data();
                  })
                );
                setStudent(newStudentssArray);
                setClassesAvailable(true);
              }
            );

            return () => {
              unsub();
            };
          } else {
            setClassesAvailable(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUser.uid]);

  return (
    <StudentsDiv>
      <AddStudentBtn
        onClick={() => setAddStudent(true)}
        addStudent={addStudent}
      >
        <AddIcon fontSize="large" />
        Add Student
      </AddStudentBtn>
      <AddStudentDiv addStudent={addStudent}>
        <AddStudentText>Add Teacher</AddStudentText>
        <TextFieldDiv>
          <InputDiv>
            <TextField
              id="outlined-basic"
              label="Student Name"
              variant="outlined"
              onChange={(e) => setStudentName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Student Class"
              variant="outlined"
              onChange={(e) => setStudentClass(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Student Login Email"
              variant="outlined"
              onChange={(e) => setStudentLoginEmail(e.target.value)}
            />
            {/* <TextField
              id="outlined-basic"
              label="Student Login Password"
              variant="outlined"
              onChange={(e) => setStudentLoginPassword(e.target.value)}
            /> */}
          </InputDiv>
          <ButtonDiv>
            <Button variant="contained" color="success" onClick={handleClick}>
              Confirm
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setAddStudent(false)}
            >
              Cancel
            </Button>
          </ButtonDiv>
        </TextFieldDiv>
      </AddStudentDiv>
      {classesAvailable ? (
        <StudentData>
          {student.map((teacher) => (
            <StudentCard key={teacher.uid} teacher={teacher} />
          ))}
        </StudentData>
      ) : (
        <NoClassDiv classesAvailable={classesAvailable}>
          No Student Added !!!
        </NoClassDiv>
      )}
    </StudentsDiv>
  );
}

const StudentCard = ({ teacher }) => {
  return (
    <CardContainer>
      <TeacherName>Student Name: {teacher.displayName}</TeacherName>
      <TeacherUID>Class: {teacher.class}</TeacherUID>
      <TeacherEmail>Email: {teacher.loginEmail}</TeacherEmail>
      {/* Add more fields as needed */}
    </CardContainer>
  );
};

export default Students;

const StudentsDiv = styled.div`
  width: 98%;
  height: 100%;
  padding: 0 1%;
  overflow: auto;
`;

const AddStudentBtn = styled.div`
  background-color: transparent;
  border: 2px solid #2e3b55;
  color: #2e3b55;
  border-radius: 5px;
  font-size: 1.7rem;
  cursor: pointer;
  padding: 8px;
  display: ${(props) => (props.addStudent ? "none" : "flex")};
  width: 12%;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #2e3b55;
    color: white;
  }
`;

const AddStudentDiv = styled.div`
  display: ${(props) => (props.addStudent ? "flex" : "none")};
  gap: 12px;
  flex-direction: column;
`;

const AddStudentText = styled.div`
  font-size: 1.8rem;
  color: #2e3b55;
  font-weight: bold;
`;

const TextFieldDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputDiv = styled.div`
  display: flex;
  gap: 12px;
`;

const ButtonDiv = styled(InputDiv)``;

const NoClassDiv = styled.div`
  display: ${(props) => (props.classesAvailable ? "none" : "flex")};
  align-items: center;
  justify-content: center;
  height: 90%;
  font-size: 4rem;
  font-weight: bold;
  color: #2e3b55;
`;

const StudentData = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CardContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  width: 15%;
  border-radius: 5px;
  cursor: pointer;
  color: #2e3b55;
`;

const TeacherName = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const TeacherUID = styled.p`
  font-size: 1rem;
`;

const TeacherEmail = styled.p`
  font-size: 1rem;
`;
