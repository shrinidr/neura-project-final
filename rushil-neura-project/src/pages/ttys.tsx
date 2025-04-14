import axios from "axios"
import SideBar from "../components/Sidebar"
import Header from "../components/header"
import {useState, useEffect} from "react"
import ChatCompo from "../components/chatCompo"
import { useRef } from "react"
import { useAuth } from "@clerk/clerk-react"



const TTys = () => {

    const [userInput, inputState] = useState<string>('')
    const {getToken} = useAuth();
    const [chatHistory, setChatHistory] = useState<Array<{ user: string, response: string, isLoading: boolean }>>([])
    const [babyState, babyStateChange] = useState<boolean>(false)
    const [ihatemylife, ihatemylifemore] = useState<string>('');

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

        if (!inputVal.trim()) return; // Don't send empty messages
        setChatHistory(prev => [...prev, { 
            user: inputVal, 
            response: '', 
            isLoading: true 
        }]);

        try {
            const token = await getToken(); // Await the token
            if (!token || token.split('.').length !== 3) {
                //console.error("Invalid token format:", token);
                return;
            }

            inputState('')
            ihatemylifemore(inputVal)

            //console.log("calling the vite backend url", import.meta.env.VITE_PYTHON_BACKEND_URL);
            const response = await axios.post(`${import.meta.env.VITE_PYTHON_BACKEND_URL}/process-chat-input`,
                { input: inputVal },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            //setChatHistory(prev => [...prev, { user: inputVal, response: response.data.response }]);

            setChatHistory(prev => {
                const newHistory = [...prev];
                const lastMessage = newHistory[newHistory.length - 1];
                if (lastMessage) {
                    lastMessage.response = response.data.response;
                    lastMessage.isLoading = false;
                }
                return newHistory;
            });

        } catch (error) {
            console.error("Error in process-chat-input request:");
            //console.error("Error in process-chat-input request:", error);
                // Update with error message if request fails
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    const lastMessage = newHistory[newHistory.length - 1];
                    if (lastMessage) {
                        lastMessage.response = "Sorry, something went wrong. Please try again.";
                        lastMessage.isLoading = false;
                    }
                    return newHistory;
                });
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
        console.log("Making the call to the backend right now.")
        const response2 = await axios.post(`${import.meta.env.VITE_PYTHON_BACKEND_URL}/storeCache`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response2)
        }
        catch (error) {
        //console.error("Error sending token data", error);
        }
    }

    useEffect(() => {
        if (!babyState) {
            makeBackendCall();
            babyStateChange(true)
        }
    }, [])

    const [unda, undeKaFunda] = useState<boolean>(false);


    const handleChildDataChange = (idk : boolean) => {
        undeKaFunda(idk);
      };

    return (
        <>
            <Header />
            <SideBar />
            <div className="main_content" ref = {mainContentRef}>
                <ChatCompo iconDataProps={handleIconChange}  onDataChange={handleChildDataChange} babyState = {babyState} verValChange= {handleVerValChange}
                inputChange = {ihatemylife}/>
                {verVal && (
                    <div className="chat_container">
                        {chatHistory.map((chat, index) => (
                            <div key={index}>
                                {chat.user && (
                                    <div className="user_input_bubble">
                                        <p>{chat.user}</p>
                                    </div>
                                )}
                                <div className="response_bubble">
                                    <i className={iconState} id="newIconState"></i>
                                    {chat.isLoading ? (
                                        <p className="spinner">⚙️</p>
                                    ) : (
                                        <p>{chat.response}</p>
                                    )}
                                </div>
                                {!isAtBottom && (
                                    <div className="scroll-to-bottomm" onClick={scrollToBottom}>
                                        <i className="fa-solid fa-arrow-down" id="ttysArrow"></i>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <div id = "coverUp">
                {unda==true?<input
                        type="text"
                        id="chatinput"
                        placeholder="Let's have a conversation."
                        autoFocus
                        autoComplete="off"
                        value={userInput}
                        onChange={(e) => inputState(e.target.value)}
                        onKeyDown={keyDownVal}
                    />:<input
                    type="text"
                    id="chatinput"
                    placeholder="Select a version, then wait for the model to build ⚙️"
                    autoFocus
                    autoComplete="off"
                    disabled/>}
                </div>
            </div>
        </>
    )
}

export default TTys