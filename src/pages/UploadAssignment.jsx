import React from "react";
import styled from "styled-components";
import { FileUpload } from "primereact/fileupload";
import "primereact/resources/themes/lara-light-indigo/theme.css";

function UploadAssignment() {
  return (
    <UploadAssignmentDiv>
      <RegisterTitle>
        <div>Upload Assignment</div>
      </RegisterTitle>
      <div className="card">
        <FileUpload
          name="demo[]"
          url={"/api/upload"}
          multiple
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
