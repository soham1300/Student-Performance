import styled from "styled-components";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../DB/FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";

function Login({ toast }) {
  const [isParantLogin, setIsParentLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const switchLoginText = isParantLogin
    ? "Login as a School Administrator"
    : "Login as a Parent or Teacher";

  const Login = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        if (isParantLogin) {
          const q = query(
            collection(db, "users"),
            where("uid", "==", user.uid)
          );

          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async (doc) => {
            if (isParantLogin) {
              if (doc.data().type === "teacher") {
                navigate("/teacher");
              } else {
                navigate("/parent-dashboard");
              }
            } else {
              navigate("/admin/classes");
            }
          });
        } else {
          const q = query(
            collection(db, "school"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot);
          if (querySnapshot.empty) {
            toast.error("Please login as a School Administrator");
            signOut(auth);
          } else {
            querySnapshot.forEach(async (doc) => {
              if (doc.data().adminName) {
                navigate("/admin/classes");
              } else {
                toast.error("Please login as a School Administrator");
                signOut(auth);
              }
            });
          }
        }
      })
      .catch(async (error) => {
        // if (error.code === "auth/invalid-credential") {
        //   const emailAvailable = await checkEmail();
        //   if (emailAvailable) {
        //     setParentRegister(true);
        //     if (password === passwordConfirm) {
        //       createUserWithEmailAndPassword(auth, email, password)
        //         .then(async (userCredential) => {
        //           const user = userCredential.user;
        //           await updateDoc(
        //             await query(
        //               collection(db, "users"),
        //               where("loginEmail", "==", email)
        //             ),
        //             {
        //               uid: user.uid,
        //             }
        //           );
        //           if (isParantLogin) {
        //             // const docSnap = await getDoc(
        //             //   await query(
        //             //     collection(db, "users"),
        //             //     where("loginEmail", "==", email)
        //             //   )
        //             // );
        //             const q = query(
        //               collection(db, "users"),
        //               where("loginEmail", "==", email)
        //             );
        //             const querySnapshot = await getDocs(q);
        //             querySnapshot.forEach((doc) => {
        //               // doc.data() is never undefined for query doc snapshots
        //               console.log(doc.id, " => ", doc.data());
        //               if (doc.data().type === "teacher") {
        //                 navigate("/teacher");
        //               } else {
        //                 navigate("/student");
        //               }
        //             });
        //           } else {
        //             navigate("/admin/classes");
        //           }
        //         })
        //         .catch((error) => {
        //           const errorMessage = error.message;
        //           console.log(errorMessage);
        //           // ..
        //         });
        //     } else {
        //       toast.error("Password doesn't match");
        //     }
        //   }
        // } else {
        //   toast.error(error.code);
        // }
        //Useful code
        // if (error.code === "auth/invalid-credential") {
        //   const emailAvailable = await checkEmail();
        //   if (emailAvailable) {
        //     setParentRegister(true);
        //     createUserWithEmailAndPassword(auth, email, password)
        //       .then(async (userCredential) => {
        //         const user = userCredential.user;
        //         const q = query(
        //           collection(db, "users"),
        //           where("loginEmail", "==", email)
        //         );
        //         const querySnapshot = await getDocs(q);
        //         querySnapshot.forEach(async (doc) => {
        //           await updateDoc(doc.ref, {
        //             uid: user.uid,
        //           });
        //           if (isParantLogin) {
        //             if (doc.data().type === "teacher") {
        //               navigate("/teacher");
        //             } else {
        //               navigate("/student");
        //             }
        //           } else {
        //             navigate("/admin/classes");
        //           }
        //         });
        //       })
        //       .catch((error) => {
        //         const errorMessage = error.message;
        //         console.log(errorMessage);
        //       });
        //   }
        // } else {
        //   toast.error(error.code);
        // }

        toast.error(error.code);
      });
  };

  const Register = async () => {
    const emailAvailable = await checkEmail();
    console.log(emailAvailable);
    if (emailAvailable) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const q = query(
            collection(db, "users"),
            where("loginEmail", "==", email)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
              uid: user.uid,
            });
            if (isParantLogin) {
              if (doc.data().type === "teacher") {
                navigate("/teacher");
              } else {
                navigate("/parent-dashboard");
              }
            } else {
              navigate("/admin/classes");
            }
          });
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    } else {
      toast.error("Contact admin for registration");
    }
  };

  const checkEmail = async () => {
    const usersRef = collection(db, "users");
    const q = await query(usersRef, where("loginEmail", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  return (
    <LoginBg>
      <LoginDiv>
        <ParentLoginDiv isParantLogin={isParantLogin}>
          <LoginForm>
            <Title>Parent / Teacher Login</Title>
            <Emailinput
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <Passwordinput
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <BtnDiv>
              <Button
                variant="contained"
                color="success"
                size="large"
                style={{ marginTop: "20px" }}
                onClick={Login}
              >
                Login
              </Button>
              <Button
                variant="contained"
                size="large"
                style={{ marginTop: "20px" }}
                onClick={Register}
              >
                Register
              </Button>
            </BtnDiv>
          </LoginForm>
        </ParentLoginDiv>
        <ParentLoginDivOverlay isParantLogin={isParantLogin}>
          <OverlayTitle>Welcome Parents / Teachers!</OverlayTitle>
          <OverlayDescription>
            Login to access your student's performance, stay connected with
            their educational journey, manage your class, view student progress,
            and provide valuable feedback.
          </OverlayDescription>
          <Button
            variant="contained"
            color="success"
            size="large"
            style={{ marginTop: "20px" }}
            onClick={() => setIsParentLogin(true)}
          >
            {switchLoginText}
          </Button>
        </ParentLoginDivOverlay>
        <TeacherLoginDiv isParantLogin={isParantLogin}>
          <LoginForm>
            <Title>School Administrator Login</Title>
            <Emailinput
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <Passwordinput
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <Button
              variant="contained"
              color="success"
              size="large"
              style={{ marginTop: "20px" }}
              onClick={Login}
            >
              Login
            </Button>
          </LoginForm>
        </TeacherLoginDiv>
        <TeacherLoginDivOverlay isParantLogin={isParantLogin}>
          <OverlayTitle>
            Welcome School Administrators and IT Personnel!
          </OverlayTitle>
          <OverlayDescription>
            Login here to manage the school's educational platform, view overall
            performance analytics, and administer various aspects of the system.
          </OverlayDescription>
          <Button
            variant="contained"
            color="success"
            size="large"
            style={{ marginTop: "20px" }}
            onClick={() => setIsParentLogin(false)}
          >
            {switchLoginText}
          </Button>
        </TeacherLoginDivOverlay>
      </LoginDiv>
    </LoginBg>
  );
}

export default Login;

const LoginBg = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginDiv = styled.div`
  background-color: #c5c6d0;
  height: 80%;
  width: 80%;
  border-radius: 25px;
  display: flex;
  flex-direction: row;
`;

const ParentLoginDiv = styled.div`
  display: ${(props) => !props.isParantLogin && "none"};
  height: 100%;
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TeacherLoginDiv = styled.div`
  display: ${(props) => props.isParantLogin && "none"};
  height: 100%;
  width: 50%;
  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Title = styled.p`
  font-size: 2rem;
  text-align: center;
`;

const Emailinput = styled.input.attrs({
  type: "email",
  placeholder: "Email",
})`
  margin-top: 20px;
  width: 45%;
  padding: 12px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: #cccccc;
    box-shadow: 0 0 0 2px #7c7c7c;
  }
  @media (max-width: 768px) {
    margin-top: 10px;
    width: 90%;
  }
`;

const Passwordinput = styled.input.attrs({
  type: "password",
  placeholder: "Password",
})`
  margin-top: 20px;
  width: 45%;
  padding: 12px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: #cccccc;
    box-shadow: 0 0 0 2px #7c7c7c;
  }
  @media (max-width: 768px) {
    margin-top: 10px;
    width: 90%;
  }
`;

const ParentLoginDivOverlay = styled.div`
  display: ${(props) => (props.isParantLogin ? "none" : "flex")};
  height: 100%;
  width: 50%;
  border-radius: 25px 0 0 25px;
  color: white;
  background-color: #2e3b55;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.isParantLogin ? 0 : 1)};
  transform: translateX(${(props) => (props.isParantLogin ? "100%" : "0")});
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
`;

const TeacherLoginDivOverlay = styled.div`
  display: ${(props) => (!props.isParantLogin ? "none" : "flex")};
  height: 100%;
  width: 50%;
  border-radius: 0 25px 25px 0;
  color: white;
  background-color: #2e3b55;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.isParantLogin ? 1 : 0)};
  transform: translateX(${(props) => (props.isParantLogin ? "0" : "-100%")});
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  @media (max-width: 768px) {
    display: none;
  }
`;

const OverlayTitle = styled.p`
  font-size: 2rem;
  margin: 10px;
`;

const OverlayDescription = styled.p`
  font-size: 1rem;
  text-align: center;
  margin: 20px;
`;

const BtnDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
`;
