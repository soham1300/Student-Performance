import React from "react";
import Navbar from "../component/Navbar";
import styled, { keyframes } from "styled-components";
import aboutImg from "../images/aboutImg.png";
import CheckIcon from "@mui/icons-material/Check";
import assignImg from "../images/assign.png";
import resultImg from "../images/result.png";
import progImg from "../images/prog graph.png";
import examImg from "../images/exam comment.png";
import attendImg from "../images/attendance.png";

function Home() {
  return (
    <HomeDiv>
      <Navbar />
      <MainDiv>
        <MainText>
          <MainTextTitle>Student Performance Tracking Tool</MainTextTitle>
          <MainTextSubTitle>
            Stay up to date of your student performance with EduSnap performance
            tracking.
          </MainTextSubTitle>
        </MainText>
      </MainDiv>
      <About id="about">
        <AboutTitle>About Student Performance Tracking Tool</AboutTitle>
        <AboutInfo>
          <AboutImg src={aboutImg} alt="" srcset="" />
          <AboutText>
            Welcome to our Student Performance Tracking Tool – a comprehensive
            solution designed to empower educators, parents, and students by
            providing valuable insights into academic progress and performance.{" "}
            <br />
            <br /> Our mission is to enhance the educational experience by
            offering a platform that facilitates efficient tracking, analysis,
            and communication of student performance. We believe that informed
            stakeholders can collaborate more effectively to support students on
            their academic journey.
          </AboutText>
        </AboutInfo>
      </About>
      <Features id="features">
        <FeaturesTitle>Features</FeaturesTitle>
        {/* Assignment Summary */}
        <FeaturesInfo>
          <FeaturesImgDiv>
            <FeaturesImg src={assignImg} alt="" srcset="" />
          </FeaturesImgDiv>

          <FeaturesText>
            <FeaturesTextTitle>Assignment Summary</FeaturesTextTitle>
            <CheckIcon color="success" /> Get student assignment performance in
            one place.
            <br />
            <CheckIcon color="success" /> Track assignment status, reviews &
            history of all subjects in one place.
            <br />
            <CheckIcon color="success" /> Get Lifelong access to Student's
            Assignment portfolios.
          </FeaturesText>
        </FeaturesInfo>
        {/* Student Results */}
        <FeaturesInfo>
          <FeaturesText>
            <FeaturesTextTitle>Student Results</FeaturesTextTitle>
            <CheckIcon color="success" /> Track performance in all exams: Marks,
            Grade, Percentage & Percentile achieved.
            <br />
            <CheckIcon color="success" /> Compare performance in different
            subjects.
            <br />
            <CheckIcon color="success" /> Get underperforming subjects.
            <br />
            <CheckIcon color="success" /> Get actionable insights to improve
            student performance.
          </FeaturesText>
          <FeaturesImgDiv>
            <FeaturesImg src={resultImg} alt="" srcset="" />
          </FeaturesImgDiv>
        </FeaturesInfo>
        {/* Student Progress Graph */}
        <FeaturesInfo>
          <FeaturesImgDiv>
            <FeaturesImg src={progImg} alt="" srcset="" />
          </FeaturesImgDiv>

          <FeaturesText>
            <FeaturesTextTitle>Student Progress Graph</FeaturesTextTitle>
            <CheckIcon color="success" /> Get accurate student performance
            graphs for all subjects.
            <br />
            <CheckIcon color="success" /> Track student exam performance with
            the help of graphs, take necessary corrective actions.
          </FeaturesText>
        </FeaturesInfo>
        {/* Exam Comment */}
        <FeaturesInfo>
          <FeaturesText>
            <FeaturesTextTitle>Exam Comment</FeaturesTextTitle>
            <CheckIcon color="success" /> Track Student Performance & teacher
            feedback for every exam in one central place.
          </FeaturesText>
          <FeaturesImgDiv>
            <FeaturesImg src={examImg} alt="" srcset="" />
          </FeaturesImgDiv>
        </FeaturesInfo>
        {/* Attendance */}
        <FeaturesInfo>
          <FeaturesImgDiv>
            <FeaturesImg src={attendImg} alt="" srcset="" />
          </FeaturesImgDiv>

          <FeaturesText>
            <FeaturesTextTitle>Attendance</FeaturesTextTitle>
            <CheckIcon color="success" /> Track student attendance across all
            subjects.
            <br />
            <CheckIcon color="success" /> Get subject-wise average attendance
            and class average attendance.
          </FeaturesText>
        </FeaturesInfo>
      </Features>
    </HomeDiv>
  );
}

export default Home;

const HomeDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const MainText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
`;

const MainTextTitle = styled.p`
  font-size: 5rem;
`;

const MainTextSubTitle = styled.p`
  font-size: 1.5rem;
`;

const About = styled.div`
  padding-top: 25px;
  width: 75vw;
`;

const AboutTitle = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
`;

const AboutText = styled.p`
  font-size: 1.5rem;
  text-align: left;
`;

const AboutImg = styled.img`
  width: 37vw;
`;

const AboutInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
`;

const Features = styled.div`
  padding-top: 25px;
`;

const FeaturesTitle = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
`;

const FeaturesInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
  gap: 20px;
`;

const FeaturesText = styled.div`
  font-size: 1.5rem;
  text-align: left;
  align-items: center;
  width: 40vw;
`;

const FeaturesTextTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;
const FeaturesImg = styled.img`
  width: 35vw;
`;

const FeaturesImgDiv = styled.div`
  width: 40vw;
`;

const MainDiv = styled.div``;

const Area = styled.div`
  background: #4e54c8;
  background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);
  width: 100%;
  height: 100vh;
`;

const Circles = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Circle = styled.li`
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  animation: animate 25s linear infinite;
  bottom: -150px;

  &:nth-child(1) {
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
  }

  /* ... styles for other circles ... */
`;

const animate = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }

  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
`;
