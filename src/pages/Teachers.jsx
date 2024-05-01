import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  arrayUnion,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { UserContext } from "../context/UserContex";
import { db } from "../DB/FirebaseConfig";

import { AuthContext } from "../context/AuthContext";
import MenuItem from "@mui/material/MenuItem";

function Teachers({ toast }) {
  const [addTeacher, setAddTeacher] = useState(false);
  const [classesAvailable, setClassesAvailable] = useState(false);
  const [teacherName, setTeacherName] = useState();
  const [teacherClass, setTeacherClass] = useState();
  const [teacherLoginEmail, setTeacherLoginEmail] = useState();

  const { userData } = useContext(UserContext);
  const { currentUser } = useContext(AuthContext);

  const [teachers, setTeachers] = useState([]);

  const [schoolData, setSchoolData] = useState({});

  const handleClick = async () => {
    const classPresent = userData.classes.some(
      (cls) => cls.className === teacherClass
    );
    console.log(classPresent);
    if (classPresent) {
      userData.classes.map(async (cls) => {
        if (cls.className === teacherClass) {
          await updateDoc(doc(db, "classes", cls.id), {
            classTeacher: teacherName,
          });

          Register(cls.id, cls.className);
        }
      });
      setAddTeacher(false);
    } else {
      toast.error("Class Not Available");
    }
  };

  // const Register = (clsId, className) => {
  //   createUserWithEmailAndPassword(
  //     auth,
  //     teacherLoginEmail,
  //     teacherLoginPassword
  //   )
  //     .then(async (userCredential) => {
  //       const user = userCredential.user;
  //       await setDoc(doc(db, "users", user.uid), {
  //         uid: user.uid,
  //         displayName: teacherName,
  //         classId: clsId,
  //         class: className,
  //         loginEmail: teacherLoginEmail,
  //         timestamp: serverTimestamp(),
  //         type: "teacher",
  //       });
  //       await updateDoc(doc(db, "school", currentUser.uid), {
  //         teachers: arrayUnion({ name: teacherName, uid: user.uid }),
  //       });
  //       // navigate("/teacher");
  //       await auth.signOut();
  //     })
  //     .catch((error) => {
  //       const errorMessage = error.message;
  //       console.log(errorMessage);
  //       // ..
  //     });
  // };
  const Register = async (clsId, className) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        displayName: teacherName,
        classId: clsId,
        class: className,
        loginEmail: teacherLoginEmail,
        timestamp: serverTimestamp(),
        type: "teacher",
      });

      await updateDoc(doc(db, "school", currentUser.uid), {
        teachers: arrayUnion({ name: teacherName, uid: docRef.id }),
      });

      // const docData = await getDoc(doc(db, "users", docRef.uid));

      // teachers.push(docData.data());
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     userData.teachers.map(async (teacher) => {
  //       const docData = await getDoc(doc(db, "users", teacher.uid));
  //       setTeachers(...teachers, docData.data());
  //     });
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser.uid) {
          const schoolData = await getDoc(doc(db, "school", currentUser.uid));
          console.log(schoolData.data());
          setSchoolData(schoolData.data());

          if (schoolData.exists()) {
            const newTeachersArray = await Promise.all(
              schoolData.data().teachers.map(async (teacher) => {
                const docData = await getDoc(doc(db, "users", teacher.uid));
                return docData.data();
              })
            );

            setTeachers(newTeachersArray);
            setClassesAvailable(true);

            const unsub = onSnapshot(
              doc(db, "school", currentUser.uid),
              async (schoolDoc) => {
                const newTeachersArray = await Promise.all(
                  schoolDoc.data().teachers.map(async (teacher) => {
                    const docData = await getDoc(doc(db, "users", teacher.uid));
                    return docData.data();
                  })
                );
                setTeachers(newTeachersArray);
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

  const handleClassChange = (e) => {
    setTeacherClass(e.target.value);
  };

  return (
    <TeachersDiv>
      <AddTeacherBtn
        onClick={() => setAddTeacher(true)}
        addTeacher={addTeacher}
      >
        <AddIcon fontSize="large" />
        Add Teacher
      </AddTeacherBtn>
      <AddTeacherDiv addTeacher={addTeacher}>
        <AddTeacherText>Add Teacher</AddTeacherText>
        <TextFieldDiv>
          <InputDiv>
            <TextField
              id="outlined-basic"
              label="Teacher Name"
              variant="outlined"
              onChange={(e) => setTeacherName(e.target.value)}
            />

            <TextField
              id="outlined-basic"
              label="Teacher Class"
              variant="outlined"
              select
              value={teacherClass}
              onChange={handleClassChange}
              style={{ width: "200px" }}
            >
              {schoolData.classes &&
                schoolData.classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.className}>
                    {cls.className}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              id="outlined-basic"
              label="Teacher Login Email"
              variant="outlined"
              onChange={(e) => setTeacherLoginEmail(e.target.value)}
            />
          </InputDiv>
          <ButtonDiv>
            <Button variant="contained" color="success" onClick={handleClick}>
              Confirm
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setAddTeacher(false)}
            >
              Cancel
            </Button>
          </ButtonDiv>
        </TextFieldDiv>
      </AddTeacherDiv>
      {classesAvailable ? (
        <TeacherData>
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.uid} teacher={teacher} />
          ))}
        </TeacherData>
      ) : (
        <NoClassDiv>No Teacher Added !!!</NoClassDiv>
      )}
    </TeachersDiv>
  );
}

const TeacherCard = ({ teacher }) => {
  return (
    <CardContainer>
      <TeacherName>Teacher Name: {teacher.displayName}</TeacherName>
      <TeacherUID>Class: {teacher.class}</TeacherUID>
      <TeacherEmail>Email: {teacher.loginEmail}</TeacherEmail>
      {/* Add more fields as needed */}
    </CardContainer>
  );
};

export default Teachers;

const TeachersDiv = styled.div`
  width: 98%;
  height: 100%;
  padding: 0 1%;
  overflow: auto;
`;

const AddTeacherBtn = styled.div`
  background-color: transparent;
  border: 2px solid #2e3b55;
  color: #2e3b55;
  border-radius: 5px;
  font-size: 1.7rem;
  cursor: pointer;
  padding: 8px;
  display: ${(props) => (props.addTeacher ? "none" : "flex")};
  width: 20%;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #2e3b55;
    color: white;
  }
`;

const AddTeacherDiv = styled.div`
  display: ${(props) => (props.addTeacher ? "flex" : "none")};
  gap: 12px;
  flex-direction: column;
`;

const AddTeacherText = styled.div`
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

const TeacherData = styled.div`
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
