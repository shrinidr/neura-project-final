import SideBar from "../components/Sidebar";
import TextArea from "../components/TextArea";
import Header from "../components/header";
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

const MainPage = () => {

    const { user, isSignedIn } = useUser();
    const {getToken} = useAuth();
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


    const makeBackendCall = async () => {

        try{
        const token = await getToken();
        console.log(token)
        const response2 = await axios.post("http://127.0.0.1:5001/storeCache", {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response2)
        }
        catch (error) {
        console.error("Error sending token data", error);
        }
    }

    useEffect(() => {
        let isCalled = false;
        if (!isCalled) {
            makeBackendCall();
            isCalled = true;
        }
    }, [])


    return (
        <div>
        <Header/>
        <SideBar/>
        <TextArea items = {TextStuff} />
        </div>
    );
}

export default MainPage