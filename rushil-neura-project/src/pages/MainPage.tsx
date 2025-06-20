import SideBar from "../components/Sidebar";
import TextArea from "../components/TextArea";
import Header from "../components/header";
import { useUser } from "@clerk/clerk-react";

const MainPage = () => {
    const { isSignedIn } = useUser();

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
            <Header />
            <SideBar />
            <TextArea items={TextStuff} />
        </div>
    );
};

export default MainPage;
