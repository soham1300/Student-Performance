import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

function AddAssignment() {
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [assignment, setAssignment] = useState("");

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAssignmentChange = (e) => {
    setAssignment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // call API to add assignment
  };

  const subjects = [
    "English",
    "Hindi",
    "Marathi",
    "Maths",
    "Science",
    "History",
    "Geography",
  ];

  // Now you can use the subjectOptions array in your JSX to render the options

  return (
    <AddAssignmentDiv>
      <RegisterTitle>ADD ASSIGNMENT</RegisterTitle>
      <form onSubmit={handleSubmit}>
        <Label>
          Select Subject:
          <StyledSelect value={subject} onChange={handleSubjectChange}>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </StyledSelect>
        </Label>

        <Label>
          Title:
          {/* <input type="text" value={title} onChange={handleTitleChange} /> */}
          <StyledInput
            type="text"
            placeholder="Enter assignment title"
            onChange={handleTitleChange}
          />
        </Label>

        <AssignmentLabel>
          Assignment
          {/* <textarea value={assignment} /> */}
          <StyledTextArea
            placeholder="Enter your assignment details here"
            onChange={handleAssignmentChange}
          ></StyledTextArea>
        </AssignmentLabel>
        <SendBtnDiv>
          <Button
            variant="contained"
            color="success"
            size="large"
            type="submit"
            endIcon={<SendIcon />}
            // onClick={() => handleSendAttendance()}
          >
            Add Assignment
          </Button>
        </SendBtnDiv>
        {/* <button type="submit">Add Assignment</button> */}
      </form>
    </AddAssignmentDiv>
  );
}

export default AddAssignment;

const RegisterTitle = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  justify-content: center;
  background-color: #2e3b55;
  padding: 20px;
  color: white;
`;

const AddAssignmentDiv = styled.div``;

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

const StyledTextArea = styled.textarea`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  width: 90%;
  height: 400px;
  &:focus {
    border-color: #007bff;
  }
`;

const AssignmentLabel = styled(Label)`
  display: flex;
  flex-direction: column;
`;

const SendBtnDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  font-size: 2rem;
`;
