//import { useState, useEffect, useRef } from "react";
import SideBar from "../components/Sidebar";
import TextArea from "../components/TextArea";
import Header from "../components/header";
import { useUser } from "@clerk/clerk-react";

const MainPage = () => {
    const { isSignedIn } = useUser();
    //const [showOnboarding, setShowOnboarding] = useState(false);
    //const [currentIndex, setCurrentIndex] = useState(0);
    
    /*const onboardingSteps = [
        { image: "/testdisplay.png", title: "Home", text: "Hello! The text for this section will be added in the future." },
        { image: "/testdisplay2.jpg", title: "Insights", text: "Insights. The text for this section will be added in the future." },
        { image: "/testdisplay3.jpg", title: "aiNA", text: "aiNA. The text for this section will be added in the future." },
        { image: "/testdisplay4.jpg", title: "Health", text: "Health. The text for this section will be added in the future." }
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
    };*/

    /*const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setShowOnboarding(false);
        }
    };*/

    /*useEffect(() => {
        if (isSignedIn) {
            setShowOnboarding(true);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSignedIn]);*/

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

    return (
        <div className="main-page">
            {/*{showOnboarding && (
                <div className="onboarding-overlay">
                    <div
                        className="onboarding-content"
                        ref={modalRef}
                    >
                        <img 
                            src={onboardingSteps[currentIndex].image} 
                            alt="Onboarding" 
                            className={`onboarding-image ${isSliding ? (transitionDirection === "left" ? "slide-out-left" : "slide-out-right") : "slide-in"}`}
                        />
                        <h2>{onboardingSteps[currentIndex].title}</h2>
                        <p>{onboardingSteps[currentIndex].text}</p>
                        <ul className="onboarding-slides-indicators">
                            {onboardingSteps.map((_, index) => (
                                <li 
                                    key={index} 
                                    className={`onboarding-slides-indicator ${index === currentIndex ? "onboarding-slides-indicator--active" : ""}`}
                                    onClick={() => handleStepClick(index)}
                                ></li>
                            ))}
                        </ul>
                
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
            )}*/}
            <Header />
            <SideBar />
            <TextArea items={TextStuff} />
        </div>
    );
};

export default MainPage;
