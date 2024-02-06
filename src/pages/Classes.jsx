import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  doc,
  addDoc,
  collection,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Classes({ toast }) {
  const [classesAvailable, setClassesAvailable] = useState(false);
  const [addClass, setAddClass] = useState(false);
  const [className, setClassName] = useState();
  const [classes, setClasses] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const HandleClick = () => {
    if (!className) {
      toast.error("Enter Class Name");
    } else {
      AddClass();
    }
  };

  const AddClass = async () => {
    const docRef = await addDoc(collection(db, "classes"), {
      className: className,
      classTeacher: "",
    });

    await updateDoc(doc(db, "school", currentUser.uid), {
      classes: arrayUnion({ className: className, id: docRef.id }),
    });

    setAddClass(false);
    setClassName();
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const first = await getDocs(collection(db, "classes"));
  //       const documentSnapshots = first.docs;

  //       if (documentSnapshots.length === 0) {
  //         setClassesAvailable(false);
  //       } else {
  //         setClasses(documentSnapshots.map((doc) => doc.data()));
  //         setClassesAvailable(true);
  //       }
  //       const unsubscribe = onSnapshot(
  //         collection(db, "classes"),
  //         (snapshot) => {
  //           setClasses(snapshot.docs.map((doc) => doc.data()));
  //           setClassesAvailable(snapshot.docs.length > 0);
  //         }
  //       );

  //       return () => {
  //         unsubscribe();
  //       };
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "school", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.data().classes.length === 0 || !docSnap.data().classes) {
          setClassesAvailable(false);
        } else {
          setClasses(docSnap.data().classes);
          setClassesAvailable(true);
        }
        const unsub = onSnapshot(doc(db, "school", currentUser.uid), (doc) => {
          setClasses(doc.data().classes);
        });

        return () => {
          unsub();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [currentUser.uid]);

  if (!classes) {
    return <p>Loading....</p>;
  }
  console.log(classes);
  return (
    <ClassesDiv>
      <AddClassBtn onClick={() => setAddClass(true)} addClass={addClass}>
        <AddIcon fontSize="large" />
        Add Class
      </AddClassBtn>
      <AddClassDiv addClass={addClass}>
        <AddClassText>Add Class</AddClassText>
        <TextFieldDiv>
          <InputDiv>
            <TextField
              id="outlined-basic"
              label="Class Name"
              variant="outlined"
              onChange={(e) => setClassName(e.target.value)}
            />
          </InputDiv>
          <ButtonDiv>
            <Button variant="contained" color="success" onClick={HandleClick}>
              Confirm
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setAddClass(false)}
            >
              Cancel
            </Button>
          </ButtonDiv>
        </TextFieldDiv>
      </AddClassDiv>
      <ShowClassesDiv classesAvailable={classesAvailable}>
        {classesAvailable ? (
          classes.map((classItem) => (
            <Class
              key={classItem.className}
              onClick={() => navigate(`/admin/class/${classItem.id}`)}
            >
              Class: {classItem.className}
            </Class>
          ))
        ) : (
          <NoClassDiv>No Class Added !!!</NoClassDiv>
        )}
      </ShowClassesDiv>
    </ClassesDiv>
  );
}

export default Classes;

const ClassesDiv = styled.div`
  width: 98%;
  height: 100%;
  padding: 0 1%;
  overflow: auto;
`;

const AddClassBtn = styled.div`
  background-color: transparent;
  border: 2px solid #2e3b55;
  color: #2e3b55;
  border-radius: 5px;
  font-size: 1.7rem;
  cursor: pointer;
  padding: 8px;
  display: ${(props) => (props.addClass ? "none" : "flex")};
  width: 10%;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #2e3b55;
    color: white;
  }
`;

const NoClassDiv = styled.div`
  display: ${(props) => (props.classesAvailable ? "none" : "flex")};
  align-items: center;
  justify-content: center;
  height: 90%;
  font-size: 4rem;
  font-weight: bold;
  color: #2e3b55;
`;

const AddClassDiv = styled.div`
  display: ${(props) => (props.addClass ? "flex" : "none")};
  gap: 12px;
  flex-direction: column;
`;

const AddClassText = styled.div`
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

const ShowClassesDiv = styled.div`
  height: ${(props) => !props.classesAvailable && "90%"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const Class = styled.div`
  width: 15%;
  background-color: #d4d4d4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 2rem;
  padding: 20px 0;
  border-radius: 10px;
  margin: 12px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  }
`;
