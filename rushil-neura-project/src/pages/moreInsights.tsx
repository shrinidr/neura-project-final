import Header from "../components/header"
import SideBar from "../components/Sidebar"
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
const MoreInsights = () => {

    const {getToken} = useAuth();
    const [apiCalled, apiCalledChange] = useState<boolean>(false);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const scrollToBottom = () => {
    if (mainContentRef.current) {
        mainContentRef.current.scrollTop = mainContentRef.current.scrollHeight;
    }
    };

    const handleScroll = () => {
    if (mainContentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = mainContentRef.current;
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight);
        }
    };

    useEffect(() => {
        const mainContent = mainContentRef.current;
        if (mainContent) {
            mainContent.addEventListener('scroll', handleScroll);
            return () => mainContent.removeEventListener('scroll', handleScroll);
        }
    }, []);


    const callStravaBackend = async () => {

        try{
            const token = await getToken();
            const response2 = await axios.post("http://127.0.0.1:6001/storeActivitiesData", {}, {
            headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response2)
        }
        catch(error){
            console.error(`This is the error: ${error}`)
        }
    }

    useEffect(() => {

        if(!apiCalled){
            callStravaBackend()
            apiCalledChange(true)
        }
    }, [])


    return (
        <div>
        <Header/>
        <SideBar/>
        <div className="main_content" ref={mainContentRef}>
        <div className="head">
            <p className='data_head'> Your fitness insights. </p>
        </div>
        {!isAtBottom &&
        (<div className="scroll-bottom" onClick = {scrollToBottom}>
                <i className="fa-solid fa-arrow-down" ></i> </div>)
        }
        </div>
        </div>
    )

}
export default MoreInsights