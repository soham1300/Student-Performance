import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { FileUpload } from "primereact/fileupload";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { storage, db } from "../DB/FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  updateDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function UploadAssignment() {
  const { currentUser } = useContext(AuthContext);
  const userUid = currentUser.uid;
  const [classUid, setClassUid] = useState("");
  const [classData, setClassData] = useState({ assignments: [] });
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", userUid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          setClassUid(document.data().classId);
          setUserId(document.id);

          // Fetch class data
          const classDocRef = doc(db, "classes", document.data().classId);
          const classDoc = await getDoc(classDocRef);
          if (classDoc.exists()) {
            setClassData(classDoc.data());
          } else {
            console.log("No such document!");
          }
        });
      } catch (error) {
        console.error("Error fetching class ID:", error);
      }
    };
    fetchData();
  }, [userUid]);

  const onUpload = async (e) => {
    const file = e.files[0];
    const storageRef = ref(storage, file.name);

    try {
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);
      console.log("File uploaded successfully:", fileUrl);

      if (classUid && selectedAssignment) {
        const updatedAssignments = classData.assignments.map((assignment) => {
          if (assignment.title === selectedAssignment) {
            if (!assignment.submissions) {
              assignment.submissions = [];
            }
            assignment.submissions.push({
              uid: userId,
              url: fileUrl,
            });
          }
          return assignment;
        });

        const classDocRef = doc(db, "classes", classUid);
        await updateDoc(classDocRef, {
          assignments: updatedAssignments,
        });

        console.log("Assignment added successfully");
        toast.success("Assignment uploaded successfully!");
      } else {
        console.error("Class UID or selected assignment not found");
      }
    } catch (error) {
      console.error("Error uploading file and saving URL:", error);
    }
  };

  return (
    <UploadAssignmentDiv>
      <RegisterTitle>
        <div>Upload Assignment</div>
      </RegisterTitle>
      <TitleSelectWrapper>
        <Title>Select Assignment:</Title>
        <SelectWrapper>
          <Select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
          >
            <option value="" disabled>
              Select Assignment
            </option>
            {classData.assignments.map((assignment, index) => (
              <option key={index} value={assignment.title}>
                {assignment.title}
              </option>
            ))}
          </Select>
        </SelectWrapper>
      </TitleSelectWrapper>
      <div className="card">
        <FileUpload
          name="demo[]"
          customUpload
          uploadHandler={onUpload}
          accept="application/pdf"
          maxFileSize={100000000}
          emptyTemplate={
            <p className="m-0">Drag and drop files here to upload.</p>
          }
        />
      </div>
    </UploadAssignmentDiv>
  );
}

export default UploadAssignment;

const UploadAssignmentDiv = styled.div``;

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

const TitleSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.p`
  font-size: 2rem;
  margin-right: 10px;
  font-weight: bold;
  color: #2e3b55;
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-grow: 1;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;
