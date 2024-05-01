import React, { useState } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import userImg from "../images/user.png";
import Button from "@mui/material/Button";
import { auth, db, storage } from "../DB/FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function Register({ toast }) {
  const [schoolName, setSchoolName] = useState();
  const [schoolAddress, setSchoolAddress] = useState();
  const [schoolContact, setSchoolContact] = useState();
  const [schoolEmail, setSchoolEmail] = useState();
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [adminName, setAdminName] = useState();
  const [adminContact, setAdminContact] = useState();
  const [adminEmail, setAdminEmail] = useState();
  const [loginEmail, setLoginEmail] = useState();
  const [loginPass, setLoginPass] = useState();
  const [loginConfirmPass, setLoginConfirmPass] = useState();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !schoolName ||
      !schoolAddress ||
      !schoolContact ||
      !schoolEmail ||
      !file ||
      !adminName ||
      !adminContact ||
      !adminEmail ||
      !loginEmail ||
      !loginPass ||
      !loginConfirmPass
    ) {
      toast.error("All fields are required");
      return;
    }

    if (loginPass !== loginConfirmPass) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await SignUp();
      toast.success("Registration successful!");
      navigate("/admin");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const SignUp = async () => {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      loginEmail,
      loginPass
    );
    const user = userCredential.user;

    // Upload file to storage
    const storageRef = ref(storage, `avatars/${user.uid}`);
    await uploadBytesResumable(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update user profile with school name and photo URL
    await updateProfile(user, {
      displayName: schoolName,
      photoURL: downloadURL,
    });

    // Add user to the database
    await setDoc(doc(db, "school", user.uid), {
      uid: user.uid,
      photoURL: downloadURL,
      displayName: schoolName,
      schoolEmail: schoolEmail,
      schoolContact: schoolContact,
      schoolAddress: schoolAddress,
      loginEmail: loginEmail,
      adminName: adminName,
      adminContact: adminContact,
      adminEmail: adminEmail,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <RegisterDiv>
      <RegisterTitle>
        Join EduSnap: Empowering Schools for Excellence
      </RegisterTitle>
      <RegisterText>Registration Form</RegisterText>
      <RegisterForm>
        <SchoolInfoText>School Info</SchoolInfoText>
        <TextField
          id="filled-basic"
          label="School Name"
          variant="outlined"
          required
          style={{ width: "45%", margin: "0 20px 20px 20px" }}
          onChange={(e) => setSchoolName(e.target.value)}
        />
        <TextField
          id="filled-basic"
          label="School Address"
          variant="outlined"
          required
          style={{ width: "45%", margin: "0 20px 20px 20px" }}
          onChange={(e) => setSchoolAddress(e.target.value)}
        />
        <TextField
          id="filled-basic"
          label="School Contact no."
          variant="outlined"
          type="number"
          required
          style={{ width: "45%", margin: "0 20px 20px 20px" }}
          onChange={(e) => setSchoolContact(e.target.value)}
        />
        <TextField
          id="filled-basic"
          label="School Email"
          variant="outlined"
          type="email"
          required
          style={{ width: "45%", margin: "0 20px 20px 20px" }}
          onChange={(e) => setSchoolEmail(e.target.value)}
        />
        <InputImg>
          <input
            type="file"
            src=""
            alt=""
            onChange={handleFileChange}
            id="file"
            style={{ display: "none" }}
            accept="image/*"
            multiple="false"
            required
          />
          <label
            htmlFor="file"
            className="file"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "12px",
              width: "50%",
            }}
          >
            {image ? (
              <img src={image} alt="mU99dd3IFo" height={40} />
            ) : (
              <img src={userImg} alt="mU99dd3IFo" height={40} />
            )}
            <p>Add Avatar</p>
          </label>
        </InputImg>

        <SchoolInfoText>
          Administrator/Contact Person Information
        </SchoolInfoText>
        <TextField
          id="filled-basic"
          label="Administrator Name"
          variant="outlined"
          required
          style={{ width: "45%", margin: "0 20px 20px 20px" }}
          onChange={(e) => setAdminName(e.target.value)}
        />
        <TextField
          id="filled-basic"
          label="Administrator Contact no."
          variant="outlined"
          type="number"
          required
          style={{ width: "45%", margin: "0 20px 20px 20px" }}
          onChange={(e) => setAdminContact(e.target.value)}
        />
        <TextField
          id="filled-basic"
          label="Administrator Email"
          variant="outlined"
          type="email"
          required
          style={{ width: "45%", margin: "0 20px 20px 20px" }}
          onChange={(e) => setAdminEmail(e.target.value)}
        />
        <SchoolInfoText>Login Information</SchoolInfoText>
        <TextField
          id="filled-basic"
          label="Login Email"
          variant="outlined"
          required
          style={{ width: "45%", margin: "0 20px 20px 20px" }}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <TextField
          id="filled-basic"
          label="Login Password"
          variant="outlined"
          type="number"
          required
          style={{ width: "45%", margin: "0 20px 20px 20px" }}
          onChange={(e) => setLoginPass(e.target.value)}
        />
        <TextField
          id="filled-basic"
          label="Confirm Passsword"
          variant="outlined"
          type="number"
          required
          style={{ width: "45%", margin: "0 20px 20px 20px" }}
          onChange={(e) => setLoginConfirmPass(e.target.value)}
        />
        <BtnDiv>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            Register
          </Button>
        </BtnDiv>
      </RegisterForm>
    </RegisterDiv>
  );
}

export default Register;

const RegisterDiv = styled.div`
  height: 100vh;
  width: 100%;
`;

const RegisterTitle = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  background-color: #2e3b55;
  padding: 20px 0;
  color: white;
`;

const RegisterForm = styled.form`
  margin: 50px;
`;

const SchoolInfoText = styled.p`
  font-size: 2rem;
`;

const RegisterText = styled.p`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
`;

const InputImg = styled.div`
  border: 1px solid #c4c4c4;
  width: 44.5%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 20px 20px 20px;
  border-radius: 4px;
  padding-left: 12px;
`;

const BtnDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;
