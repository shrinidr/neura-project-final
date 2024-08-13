import axios from "axios"
import SideBar from "../components/Sidebar"
import Header from "../components/header"
import {useState} from "react"
import ChatCompo from "../components/chatCompo"


const TTys = () => {

    const [userInput, inputState] = useState<string>('')

    const keyDownVal = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
        const inputVal = event.currentTarget.value
        inputState(event.currentTarget.value)
        axios.post('http://127.0.0.1:5000/process-chat-input', {input: inputVal})
        .then(response => console.log(response))
        .catch(error => {
            console.error(`i hate my life ${error}`)
        })
        }
    }
    return (
        <>
        <Header/>
        <SideBar/>
        <div className = "main_content">
            <ChatCompo/>
            <div className="head"></div>
            <input type = "text"
            id = "chatinput"
            placeholder="Lets have a conversation."
            autoFocus
            onKeyDown={keyDownVal}
            />
        </div>
        </>
    )
}

export default TTys