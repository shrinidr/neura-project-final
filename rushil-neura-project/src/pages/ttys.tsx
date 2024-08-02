import SideBar from "../components/Sidebar"
import Header from "../components/header"
import {useState, useEffect} from "react"


const TTys = () => {

    const [userInput, inputState] = useState<string>('')

    const keyDownVal = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
        inputState(event.currentTarget.value)
        }
    }
    return (
        <>
        <Header/>
        <SideBar/>
        <div className = "main_content">
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