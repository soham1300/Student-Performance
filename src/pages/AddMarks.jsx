import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "../context/AuthContext";
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

function AddMarks({ toast }) {
  const [classData, setClassData] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [subject, setSubject] = useState("English");
  const [examName, setExamName] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [marksObtained, setMarksObtained] = useState({});
  const [classId, setClassId] = useState("");
  const [examDate, setExamDate] = useState("");
  const subjects = [
    "English",
    "Hindi",
    "Marathi",
    "Maths",
    "Science",
    "History",
    "Geography",
  ];

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
          // Move assignment processing here
        } else {
          console.log("No such document!");
        }
      });
    };
    fetchData();
  }, [currentUser.uid]);

  const handleMarksChange = (studentId, marks) => {
    setMarksObtained((prevMarks) => ({
      ...prevMarks,
      [studentId]: marks,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!classData || !classId) {
      console.error("Class data or class ID is undefined.");
      return;
    }

    // Update marks in Firestore
    const classRef = doc(db, "classes", classId);
    const newMarks = {
      subject,
      examName,
      totalMarks: Number(totalMarks),
      marksObtained,
      examDate,
    };
    const updatedMarks = classData.marks
      ? [...classData.marks, newMarks]
      : [newMarks];
    await updateDoc(classRef, {
      marks: updatedMarks,
    });

    // Reset form
    setSubject("English");
    setExamName("");
    setTotalMarks("");
    setMarksObtained({});
    toast.success("Marks submitted successfully");
  };

  if (!classData) {
    return <p>Loading...</p>;
  }

  return (
    <AddMarksDiv>
      <RegisterTitle>Record Marks</RegisterTitle>
      <form onSubmit={handleSubmit}>
        <Label>
          Select Subject:
          <StyledSelect
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </StyledSelect>
        </Label>

        <Label>
          Exam Name:
          {/* <input type="text" value={title} onChange={handleTitleChange} /> */}
          <StyledInput
            value={examName}
            type="text"
            placeholder="Enter exam name"
            onChange={(e) => setExamName(e.target.value)}
            required
          />
        </Label>
        <Label>
          Exam Date:
          {/* <input type="text" value={title} onChange={handleTitleChange} /> */}
          <StyledInput
            type="date"
            onChange={(e) => setExamDate(e.target.value)}
            required
          />
        </Label>
        <Label>
          Total marks:
          {/* <input type="text" value={title} onChange={handleTitleChange} /> */}
          <StyledInput
            value={totalMarks}
            type="number"
            placeholder="Enter total marks"
            onChange={(e) => setTotalMarks(e.target.value)}
            required
          />
        </Label>
      </form>
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
          {classData &&
            classData.students &&
            classData.students.map((student, index) => (
              <tr key={student.uid}>
                <Td>{index + 1}</Td>
                <Td>{student.name}</Td>
                <Td>
                  <StyledInputTable
                    type="number"
                    placeholder="Enter marks obtained"
                    value={marksObtained[student.uid] || ""}
                    onChange={(e) =>
                      handleMarksChange(student.uid, e.target.value)
                    }
                    required
                  />
                </Td>
                <Td>{totalMarks}</Td>
              </tr>
            ))}
        </tbody>
      </Table>
      <SendBtnDiv>
        <Button
          variant="contained"
          color="success"
          size="large"
          type="submit"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
        >
          Record Marks
        </Button>
      </SendBtnDiv>
      {/* <button type="submit">Add Assignment</button> */}
    </AddMarksDiv>
  );
}

export default AddMarks;

const AddMarksDiv = styled.div``;
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

const Label = styled.label`
  display: flex;
  gap: 12px;
  margin: 12px;
  font-size: 2rem;
  font-weight: bold;
  color: #2e3b55;
`;

const StyledSelect = styled.select`
  /* Base styles for the select */
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  cursor: pointer;

  /* Styles for the options */
  & > option {
    padding: 0.5rem;
    font-size: 1rem;
    background-color: #fff;
    color: #333;
  }

  /* Hover effect for options */
  & > option:hover {
    background-color: #f5f5f5;
  }

  /* Selected option */
  & > option:checked {
    background-color: #f0f0f0;
    font-weight: bold;
  }
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;

  &:focus {
    border-color: #007bff;
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

const StyledInputTable = styled.input`
  padding: 0.5rem;
  font-size: 1.5rem;
  border-radius: 5px;
  border: none;
  outline: none;
  width: 97%;
  height: 100%;
  background-color: transparent;
  text-align: center;
`;
