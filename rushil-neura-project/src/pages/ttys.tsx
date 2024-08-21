import axios from "axios"
import SideBar from "../components/Sidebar"
import Header from "../components/header"
import {useState} from "react"
import ChatCompo from "../components/chatCompo"

const TTys = () => {

    const [userInput, inputState] = useState<string>('')

    const [chatHistory, setChatHistory] = useState<Array<{ user: string, response: string }>>([])



    const keyDownVal = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
        const inputVal = event.currentTarget.value
        inputState('')
        axios.post('http://127.0.0.1:5000/process-chat-input', {input: inputVal})
        .then(response => {
                    setChatHistory(prev => [...prev, { user: inputVal, response: response.data.response }])
                })
        .catch(error => {
            console.error(`i hate my life ${error}`)
        })
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
    return (
        <>
            <Header />
            <SideBar />
            <div className="main_content">
                <ChatCompo iconDataProps={handleIconChange}  verValChange= {handleVerValChange}/>
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
                        </div>
                    ))}
                </div>:<div/>}
                <input
                        type="text"
                        id="chatinput"
                        placeholder="Let's have a conversation."
                        autoFocus
                        value={userInput}
                        onChange={(e) => inputState(e.target.value)}
                        onKeyDown={keyDownVal}
                    />
            </div>
        </>
    )
}

export default TTys