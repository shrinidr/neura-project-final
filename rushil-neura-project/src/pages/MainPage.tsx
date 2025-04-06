import { useState, useEffect, useRef } from "react";
import SideBar from "../components/Sidebar";
import TextArea from "../components/TextArea";
import Header from "../components/header";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
    const { isSignedIn } = useUser();
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const onboardingSteps = [
        { image: "/firstOne.png", title: "Welcome to Neura!", text: "We are an AI-powered journaling platform that helps you understand yourself in powerful ways." },
        { image: "/secondOne.png", title: "Journaling", text: "Record your thoughts, ideas, experiences by following the simple prompts. Skip what you don't like!" },
        { image: "/thirdOne.png", title: "Insights", text: "Check the insights section to see trends in your happiness, stress, anxiety and a lot more!" },
        { image: "/firstOne.png", title: "aiNA", text: "Choose a version of yourself from the past, and start talking to them. Get ideas, solve issues and work together. Press done to start..." }
    ];

    const [isSliding, setIsSliding] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState("left");

    const modalRef = useRef<HTMLDivElement>(null);

    const handleNext = () => {
        if (currentIndex === onboardingSteps.length - 1) {
            setShowOnboarding(false);
        } else {
            setTransitionDirection("left");
            setIsSliding(true);
    
            setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex + 1);
                setIsSliding(false);
            }, 250);
        }
    };
    const handleBack = () => {
        if (currentIndex > 0) {
            setTransitionDirection("right");
            setIsSliding(true);
    
            setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex - 1);
                setIsSliding(false);
            }, 250);
        }
    };

    const handleStepClick = (index: number) => {
        if (index === currentIndex) return;
    
        setTransitionDirection(index < currentIndex ? "right" : "left");
        setIsSliding(true);
    
        setTimeout(() => {
            setCurrentIndex(index);
            setIsSliding(false);
        }, 250);
    };



    if (!isSignedIn) {
        return <div>Please sign in to access this page.</div>;
    }

    const TextStuff = [
        { id: "input1", content: "How was your day (In one sentence)?" },
        { id: "input2", content: "Did anything make you feel like smashing into a wall today?" },
        { id: "input3", content: "What was something that made you want to dance?" },
        { id: "input4", content: "Did you exercise today? What did you do?" },
        { id: "input5", content: "How are you dealing with stress in your life?" },
        { id: "input6", content: "Did you do anything that isn't part of your regular day?" },
        { id: "input7", content: "Any other thing that you think is worth remembering?" }
    ];

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          setShowOnboarding(false);
        }
      };

    useEffect(() => {
        // Check URL for newUser flag
        const searchParams = new URLSearchParams(location.search);
        const isNewUser = searchParams.get('newUser') === 'true';
        
        if (isNewUser) {
          setShowOnboarding(true);
          // Clean up the URL if it came from signup
          if (isNewUser) {
            navigate('/home', { replace: true });
          }
        }
      }, [isSignedIn, location.search, navigate]);
    
      useEffect(() => {
        // Only add listener when onboarding is visible
        if (showOnboarding) {
          document.addEventListener("mousedown", handleClickOutside);
        } else {
          document.removeEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [showOnboarding]);
    
    
    return (
        <div className="main-page">
            {showOnboarding && (
                <div className="onboarding-overlay">
                    <div
                        className="onboarding-content"
                        ref={modalRef}
                    >
                        <img 
                            src={onboardingSteps[currentIndex].image} 
                            alt="Onboarding" 
                            className={`onboarding-image ${isSliding ? (transitionDirection === "left" ? "slide-out-left" : "slide-out-right") : "slide-in"}`}
                            style = {{width: '280px'}}
                        />
                        <h2>{onboardingSteps[currentIndex].title}</h2>
                        <p>{onboardingSteps[currentIndex].text}</p>
                        <div className="onboarding-slides-indicators">
                            {onboardingSteps.map((_, index) => (
                                <div 
                                    key={index} 
                                    className={`onboarding-slides-indicator ${index === currentIndex ? "onboarding-slides-indicator--active" : ""}`}
                                    onClick={() => handleStepClick(index)}
                                ></div>
                            ))}
                        </div>
                
                        <div className="ob-button-container">
                            <button 
                                className={`back-button ${currentIndex === 0 ? "disabled" : ""}`} 
                                onClick={handleBack} 
                                disabled={currentIndex === 0}
                            >
                                Back
                            </button>

                            <button className="close-button" onClick={handleNext}>
                                {currentIndex === onboardingSteps.length - 1 ? "Done" : "Next"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Header />
            <SideBar />
            <TextArea items={TextStuff} />
        </div>
    );
};

export default MainPage;
