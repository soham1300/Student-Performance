import React, { useState } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import userImg from "../images/user.png";
import Button from "@mui/material/Button";
import { auth, db, storage } from "../DB/FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFile(file);
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  const handleSubmit = async () => {
    if (!schoolName) {
      return toast.error("School Name Required");
    } else if (!schoolAddress) {
      return toast.error("School Address Required");
    } else if (!schoolContact) {
      return toast.error("School Contact Required");
    } else if (!schoolEmail) {
      return toast.error("School Email Required");
    } else if (!file) {
      return toast.error("School Logo Required");
    } else if (!adminName) {
      return toast.error("Admin Name Required");
    } else if (!adminContact) {
      return toast.error("Admin Contact Required");
    } else if (!adminEmail) {
      return toast.error("Admin Email Required");
    } else if (!loginEmail) {
      return toast.error("Login Email Required");
    } else if (!loginPass) {
      return toast.error("Login Password Required");
    } else if (!loginConfirmPass) {
      return toast.error("Confirm Password Required");
    } else if (loginPass !== loginConfirmPass) {
      return toast.error("Password Doesn't Match");
    } else {
      SignUp();
    }
  };

  const checkUsername = async () => {
    const usersRef = collection(db, "school");
    const q = await query(usersRef, where("loginEmail", "==", loginEmail));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const SignUp = async () => {
    const usernameTaken = await checkUsername();
    if (usernameTaken) {
      toast.error("Username already taken!");
    } else {
      // alert("SignUp successful!");
      await createUserWithEmailAndPassword(auth, loginEmail, loginPass)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          var downloadURL = "";
          const storageRef = ref(storage, loginEmail);
          await uploadBytesResumable(storageRef, file).then(() => {
            getDownloadURL(storageRef).then((url) => {
              downloadURL = url;
            });
          });

          //Update User Data
          await updateProfile(auth.currentUser, {
            displayName: schoolName,
            photoURL: downloadURL,
          })
            .then(() => {
              console.log("Success");
            })
            .catch((error) => {
              toast.error(error);
            });

          //Add User on DB
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
          // saveLogin(user.uid);
          navigate("/admin");
        })
        .catch((error) => {
          toast.error(error);
          // ..
        });
    }
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
