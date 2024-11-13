import axios from "axios"
import SideBar from "../components/Sidebar"
import Header from "../components/header"
import {useState, useEffect} from "react"
import ChatCompo from "../components/chatCompo"
import { useRef } from "react"
import { useAuth } from "@clerk/clerk-react"



const TTys = () => {

    const [userInput, inputState] = useState<string>('')
    const [isVisible, setIsVisible] = useState(false);

    const toggleRectangle = () => {
    setIsVisible(!isVisible);
    };
    const {getToken} = useAuth();
    const [chatHistory, setChatHistory] = useState<Array<{ user: string, response: string }>>([])

    const [babyState, babyStateChange] = useState<boolean>(false)
    const [ihatemylife, ihatemylifemore] = useState<string>('')


    {/*const keyDownVal = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
        const inputVal = event.currentTarget.value;
        const token = givemeToken();
        console.log(token)
        inputState('')
        ihatemylifemore(inputVal)
        axios.post('http://127.0.0.1:5000/process-chat-input', {input: inputVal}, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
                    setChatHistory(prev => [...prev, { user: inputVal, response: response.data.response }])
                })
        .catch(error => {
            console.error(`i hate my life ${error}`)
        })
        }
    }*/}

    const keyDownVal = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        const inputVal = event.currentTarget.value;

        try {
            const token = await getToken(); // Await the token
            console.log("Retrieved Token:", token);

            if (!token || token.split('.').length !== 3) {
                console.error("Invalid token format:", token);
                return;
            }

            inputState('')
            ihatemylifemore(inputVal)

            const response = await axios.post('http://127.0.0.1:5002/process-chat-input',
                { input: inputVal },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setChatHistory(prev => [...prev, { user: inputVal, response: response.data.response }]);
        } catch (error) {
            console.error("Error in process-chat-input request:");
        }
    }
    }

    const [iconState, iconStateChange] = useState<string>('')
    const [verVal, verStateChange] = useState<boolean>(true)


    const handleVerValChange = (data: boolean) => {
        verStateChange(data)
        if(data==true){
            setChatHistory([])
        }
    }

    const handleIconChange = (data: string) =>{
        iconStateChange(data)
    }


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



    const makeBackendCall = async () => {

        try{
        const token = await getToken();
        console.log(token)
        const response2 = await axios.post("http://127.0.0.1:5002/store", {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response2)
        }
        catch (error) {
        console.error("Error sending token data", error);
        }
    }

    useEffect(() => {
        if (!babyState) {
            makeBackendCall();
            babyStateChange(true)
        }
    }, [])

    return (
        <>
            <Header />
            <SideBar />
            <div className="main_content" ref = {mainContentRef}>
                <ChatCompo iconDataProps={handleIconChange}  babyState = {babyState} verValChange= {handleVerValChange}
                inputChange = {ihatemylife}/>
                {verVal==true?
                <div className="chat_container">
                    {chatHistory.map((chat, index) => (
                        <div key={index}>
                            <div className="user_input_bubble">
                                <p>{chat.user}</p>
                            </div>
                            <div className="response_bubble">
                                <i className={iconState} id = "newIconState"> </i>
                                <p>{chat.response}</p>
                            </div>
                        {!isAtBottom &&
                (<div className="scroll-to-bottomm" onClick = {scrollToBottom}>
                    <i className="fa-solid fa-arrow-down" id="ttysArrow"></i> </div>)
                }
                    </div>

                    ))}
                </div>:<div/>}
                <div id = "coverUp">
                <input
                        type="text"
                        id="chatinput"
                        placeholder="Let's have a conversation."
                        autoFocus
                        autoComplete="off"
                        value={userInput}
                        onChange={(e) => inputState(e.target.value)}
                        onKeyDown={keyDownVal}
                    />
                </div>
            </div>
        </>
    )
}

export default TTys