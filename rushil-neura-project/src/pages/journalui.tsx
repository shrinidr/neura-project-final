import Header from "../components/header";
import SideBar from "../components/Sidebar";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import Card from "../components/loadScreen";

const questions = [
  "How was your day? (In one sentence)",
  "Did anything make you feel like smashing into a wall today?",
  "What was something that made you want to dance?",
  "Did you exercise today? What did you do?",
  "How are you dealing with stress in your life?",
  "Did you do anything that isn't part of your regular day?",
  "Any other thing that you think is worth remembering?"
];

const JournalUI = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [showJournal, setShowJournal] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const containerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = value;
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

  const handleSave = () => {
    console.log("Saved answers:", answers, "on", selectedDate);
    setShowJournal(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setShowJournal(false);
    }
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div>
      <Header />
      <SideBar />

      {showJournal && (
        <div className="journal-overlay" onClick={handleOutsideClick}>
          <div className="journal-container" ref={containerRef} onClick={(e) => e.stopPropagation()}>
            <div className="journal-header">
              <button
                className="nav-icon"
                onClick={goBack}
                disabled={currentQuestionIndex === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                     className="icon-size">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>

              <div className="journal-date">
                <span className="emoji">📝</span>
                <h2>{formattedDate}</h2>
                    <button
                    className="calendar-icon"
                    onClick={() => dateInputRef.current?.showPicker()}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon-size">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                </button>

                <input
                  ref={dateInputRef}
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ display: "none" }}
                />
              </div>

              <button
                className="nav-icon"
                onClick={goNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                     className="icon-size">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            <div className="progress-container">
              <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            <label className="question-label">{questions[currentQuestionIndex]}</label>
            
            <textarea
              className="answer-input"
              placeholder="Write here..."
              value={answers[currentQuestionIndex]}
              onChange={(e) => handleInputChange(e.target.value)}
            />

            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}

      <Card />
    </div>
  );
};

export default JournalUI;
