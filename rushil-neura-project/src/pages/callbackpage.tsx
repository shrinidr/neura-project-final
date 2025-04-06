import { useState,  useRef } from "react";
//import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
const CallBack = () => {

    const navigate  = useNavigate();
    //const { isSignedIn } = useUser();
    const [currentIndex, setCurrentIndex] = useState(0);
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
            navigate('/home');
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

    /*if (!isSignedIn) {
        return <div>Please sign in to access this page.</div>;
    }*/

    return (<div className="main-page">
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
            </div>)
    }

export default CallBack;