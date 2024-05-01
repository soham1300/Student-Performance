import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { db } from "../DB/FirebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  setDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import UserProfile from "../images/UserProfile.png";

function Chatting() {
  const [classData, setClassData] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classId, setClassId] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

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
        } else {
          console.log("No such document!");
        }
      });
    };
    fetchData();
  }, [currentUser.uid]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedStudent && classId) {
        const chatId = classId + selectedStudent.uid;
        const chatRef = doc(db, "chats", chatId);

        // Listen for changes to the chat document
        const unsubscribe = onSnapshot(chatRef, (doc) => {
          if (doc.exists()) {
            const chatData = doc.data();
            const messages = chatData.messages || []; // Use messages or empty array if not present
            setMessages(messages);
          } else {
            // Document doesn't exist, set messages to empty array
            setMessages([]);
          }
        });

        // Cleanup the listener when component unmounts or when chatId changes
        return () => {
          unsubscribe();
        };
      }
    };

    fetchData();
  }, [selectedStudent, classId]);

  // const handleStudentClick = (student) => {
  //   setSelectedStudent(student);
  // };

  const keyPressHandle = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const chatId = classId + selectedStudent.uid;
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        await updateDoc(chatRef, {
          messages: arrayUnion({
            message: message,
            sender: currentUser.uid,
            time: new Date().toISOString(),
          }),
        });
      } else {
        await setDoc(chatRef, {
          messages: [
            {
              message: message,
              sender: currentUser.uid,
              time: new Date().toISOString(),
            },
          ],
        });
      }
      setMessage("");
    }
  };

  function formatMessageTime(timeString) {
    const messageTime = new Date(timeString);
    const now = new Date();
    const diffInHours = Math.abs(now - messageTime) / 36e5;

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString();
    } else {
      return messageTime.toLocaleDateString();
    }
  }

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    // When a student is selected, mark all messages from that student as read
    const updatedMessages = messages.map((msg) =>
      msg.sender === student.uid ? { ...msg, read: true } : msg
    );
    setMessages(updatedMessages);
  };

  return (
    <ChattingDiv>
      <RegisterTitle>
        <div>Parent Connect</div>
      </RegisterTitle>
      <MainDiv>
        <LeftDiv>
          {classData &&
            classData.students.map((student, index) => (
              <Student
                key={index}
                onClick={() => handleStudentClick(student)}
                select={selectedStudent && selectedStudent.uid === student.uid}
              >
                <div>{student.name}'s Parents</div>
              </Student>
            ))}
        </LeftDiv>
        <RightDiv>
          <ChatDiv>
            {messages.map((message, index) => (
              <MessageDiv
                key={index}
                alignRight={message.sender === currentUser.uid}
                read={message.read}
              >
                <div className="user-pic">
                  <img src={UserProfile} alt="" srcset="" />
                </div>
                <div className="message-content">
                  <div className="user-name">
                    {message.sender === currentUser.uid
                      ? "You"
                      : selectedStudent.name + "'s Parents"}
                  </div>
                  <div className="message-text">{message.message}</div>
                  <div className="message-time">
                    {formatMessageTime(message.time)}
                  </div>
                </div>
              </MessageDiv>
            ))}
          </ChatDiv>
          <SendChatDiv>
            <SendMessageInput
              type="text"
              placeholder="Type message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={keyPressHandle}
            />
          </SendChatDiv>
        </RightDiv>
      </MainDiv>
    </ChattingDiv>
  );
}

export default Chatting;

const ChattingDiv = styled.div``;

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

const MainDiv = styled.div`
  display: flex;
  width: 100vw;
  height: 90vh;
`;

const LeftDiv = styled.div`
  width: 25%;
  height: 100%;
  background-color: #dddddd;
`;

const RightDiv = styled.div`
  width: 75%;
  height: 100%;
`;

const Student = styled.div`
  padding: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-size: 1.5rem;
  background-color: ${(props) => (props.select ? "#eeeeee" : "#dddddd")};
  &:hover {
    background-color: #eeeeee;
  }
`;

const ChatDiv = styled.div`
  height: 95%;
  overflow-y: scroll; /* Enable vertical scrolling */
`;

const SendChatDiv = styled.div`
  height: 5%;
`;

const SendMessageInput = styled.input`
  width: 98%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1.5rem;
  height: 100%;
  background-color: #eeeeee;
`;

const MessageDiv = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: ${(props) => (props.alignRight ? "row-reverse" : "row")};
  align-items: flex-start;

  > .user-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden; /* Ensure the image stays within the circle */
    margin-right: 10px;
  }

  > .user-pic > img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensure the image covers the entire circle */
  }

  > .message-content {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    word-wrap: break-word;
  }

  > .message-content > .user-name {
    font-weight: bold;
    margin-bottom: 3px;
  }

  > .message-content > .message-text {
    padding: 5px 10px;
    border-radius: 8px;
    background-color: ${(props) => (props.alignRight ? "#DCF8C6" : "#E8E8E8")};
  }

  > .message-content > .message-time {
    font-size: 0.8rem;
    color: limegreen;
  }
`;
