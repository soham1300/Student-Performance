import React from "react";
import Navbar from "../component/Navbar";
import styled from "styled-components";
import aboutImg from "../images/aboutImg.png";
import CheckIcon from "@mui/icons-material/Check";
import assignImg from "../images/assign.png";
import resultImg from "../images/result.png";
import progImg from "../images/prog graph.png";
import examImg from "../images/exam comment.png";
import attendImg from "../images/attendance.png";
import HomeImg from "../images/Home.svg";

function Home() {
  const isMobile = useDeviceType();

  function useDeviceType() {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // Adjust the width threshold as needed
      };

      // Initial check on mount
      handleResize();

      // Listen for window resize events
      window.addEventListener("resize", handleResize);

      // Clean up event listener on unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return isMobile;
  }
  return (
    <HomeDiv>
      <Navbar />
      <MainDiv>
        <MainText>
          <MainTextTitle>Student Performance Tracking System</MainTextTitle>
          <MainTextSubTitle>
            Stay up to date of your student performance with EduSnap performance
            tracking.
          </MainTextSubTitle>
        </MainText>
        <ImgDiv>
          <img alt="" src={HomeImg} />
        </ImgDiv>
      </MainDiv>
      <About id="about">
        <AboutTitle>About Student Performance Tracking Tool</AboutTitle>
        <AboutInfo>
          <ImgDiv>
            <AboutImg src={aboutImg} alt="" srcset="" />
          </ImgDiv>

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
          {isMobile && (
            <FeaturesImgDiv>
              <FeaturesImg src={resultImg} alt="" srcset="" />
            </FeaturesImgDiv>
          )}
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
          {!isMobile && (
            <FeaturesImgDiv>
              <FeaturesImg src={resultImg} alt="" srcset="" />
            </FeaturesImgDiv>
          )}
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
          {isMobile && (
            <FeaturesImgDiv>
              <FeaturesImg src={examImg} alt="" srcset="" />
            </FeaturesImgDiv>
          )}
          <FeaturesText>
            <FeaturesTextTitle>Exam Comment</FeaturesTextTitle>
            <CheckIcon color="success" /> Track Student Performance & teacher
            feedback for every exam in one central place.
          </FeaturesText>
          {!isMobile && (
            <FeaturesImgDiv>
              <FeaturesImg src={examImg} alt="" srcset="" />
            </FeaturesImgDiv>
          )}
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
      <Footer>&copy; 2024 Your Company Name. All Rights Reserved.</Footer>
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
  @media (max-width: 768px) {
    z-index: 1;
  }
`;

const MainTextTitle = styled.p`
  font-size: 5rem;
  margin: 0 10%;
  @media (max-width: 768px) {
    font-size: 3rem;
    text-align: center;
  }
`;

const MainTextSubTitle = styled.p`
  font-size: 1.5rem;
  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center;
  }
`;

const About = styled.div`
  padding-top: 25px;
  width: 75vw;
`;

const AboutTitle = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
  }
`;

const AboutText = styled.p`
  font-size: 1.5rem;
  text-align: left;
  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center;
  }
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
  @media (max-width: 768px) {
    text-align: center;
  }
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
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const FeaturesText = styled.div`
  font-size: 1.5rem;
  text-align: left;
  align-items: center;
  width: 40vw;
  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center;
    width: 100%;
  }
`;

const FeaturesTextTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 1.5rem;
    text-align: center;
  }
`;
const FeaturesImg = styled.img`
  width: 35vw;
`;

const FeaturesImgDiv = styled.div`
  width: 40vw;
  /* @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.3;
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
  } */
`;

const MainDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
  }
`;

const ImgDiv = styled.div`
  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.3;
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
  }
`;

const Footer = styled.footer`
  background-color: #2e3b55;
  color: white;
  text-align: center;
  padding: 20px 0;
  width: 100%;
`;
