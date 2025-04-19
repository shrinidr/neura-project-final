import React, { useRef, useState, useEffect } from "react";
import Header from "../components/header";
import SideBar from "../components/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";


const questions = [
  "How was your day? (In one sentence)",
  "Did anything make you feel like smashing into a wall today?",
  "What was something that made you want to dance?",
  "Did you exercise today? What did you do?",
  "How are you dealing with stress in your life?",
  "Did you do anything that isn't part of your regular day?",
  "Any other thing that you think is worth remembering?"
];



const CustomDateButton = React.forwardRef<HTMLButtonElement, any>(
  ({ onClick }, ref) => (
    <button className="calendar-icon" onClick={onClick} ref={ref}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="icon-size"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
        />
      </svg>
    </button>
  )
);
CustomDateButton.displayName = "CustomDateButton";

const JournalUI = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);


  const {getToken} = useAuth();
  
  const { user, isSignedIn } = useUser();

  //destructuring an array []
  const [formData, setFormData] = useState<{[key: string]: string}>({});


  const bitch  = (currleft: number) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - currleft);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(currentDate.getDate()).padStart(2, '0');
    const answer = `${year}-${month}-${day}`;
    return answer;
}


  const handlesave = async () =>{

  try{
    if (!isSignedIn || !user) return;
    changeSaveVal('Saved!');
    const token = await getToken();
    console.log('this is the form fdata', formData);
    const formattedDate = bitch(0);

    await axios.post( `${import.meta.env.VITE_BACKEND_URL}/api/data`,
      { formData, formattedDate },  // The data payload
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
        },
      }
    );

    console.log("Data submitted successfully.")
    // In your React component after saving a new entry 
    await axios.post( `${import.meta.env.VITE_PYTHON_BACKEND_URL}/refreshCache`, {}, {
    headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Cache Changes Made in redis");
    }catch(error){
      //console.log(`Error: ${error}`)
    }

  };
  const handleInputChange = (value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = value;

    const keyVal = 'input'+(currentQuestionIndex+1);
    setFormData((prevData) => ({
      ...prevData,
      [keyVal]: value,
    }));

    setAnswers(updatedAnswers);
  };

  const goNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const [saveVal, changeSaveVal] = useState<String>('Save');

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(e.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target as Node)
    ) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const easyDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });



  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const handleToggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  const calendarStyles = {
    position: "absolute" as "absolute",
    top: buttonRef.current ? `${buttonRef.current.offsetTop - 220}px` : "auto", 
    left: buttonRef.current ? `${buttonRef.current.offsetLeft}px` : "auto",
    zIndex: 1000,
    backgroundColor: "white", 
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    padding: "0.5rem",
    width: "fit-content", 
  };


  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'; // Reset height
    el.style.height = `${el.scrollHeight}px`; // Set to new height
  };
  
  return (
    <div>
      <Header />
      <SideBar />
        <div className="journal-overlay">
          <div
            className="journal-container"
            ref={containerRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="journal-header">
              <button
                className="nav-icon"
                onClick={goBack}
                disabled={currentQuestionIndex === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="icon-size"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <div className="journal-date">
                <span className="emoji">📝</span>
                <h2>{easyDate}</h2>
                <div style={{ position: "relative" }}>
                  <button
                    ref={buttonRef}
                    onClick={handleToggleCalendar}
                    className="calendar-icon"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="icon-size"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                      />
                    </svg>
                  </button>
                  {showCalendar && (
                    <div ref={calendarRef} style={calendarStyles}>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date = new Date())}
                        inline
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                className="nav-icon"
                onClick={goNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="icon-size"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
            <div className="progress-container">
              <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <label className="question-label">{questions[currentQuestionIndex]}</label>
            <textarea
              className="answer-input"
              placeholder="Write here..."
              value={answers[currentQuestionIndex]}
              onChange={(e) => handleInputChange(e.target.value)}
              onInput={(e) => autoResize(e.currentTarget)}
              rows={1}
            />
            {currentQuestionIndex==6?<button className="save-button" onClick={handlesave}>
              {saveVal}
            </button>:''}
          </div>
        </div>
    </div>
  );
};

export default JournalUI;
