import SideBar from "../components/Sidebar";
import TextArea from "../components/TextArea";
import Header from "../components/header";
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook

const MainPage = () => {

    const {isSignedIn } = useUser();
    if (!isSignedIn) {
    return <div>Please sign in to access this page.</div>;
    }
    const TextStuff = [{id: "input1", content: "How was your day (In one sentence)?"},
        {id: "input2", content: "How many times did you feel like smashing a wall?"},
        {id: "input3", content: "How many times did you feel like dancing with said wall?" },
        {id: "input4", content: "How much did you exercise?"},
        {id: "input5", content: "How is your stress situation?"},
        {id: "input6", content: "Did you do anything that isn't part of your regular day?"},
        {id: "input7", content: "Any other thing that you think is worth remembering?"}
    ]

    return (
        <div>
        <Header/>
        <SideBar/>
        <TextArea items = {TextStuff} />

        </div>
    );
}

export default MainPage