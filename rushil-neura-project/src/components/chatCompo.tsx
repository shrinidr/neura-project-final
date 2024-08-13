
import { useState } from "react"


{/* Lets just assume for now that we have exactly 5 models equally distributed between all the time
    that user data has been entered for simplicity purposes*/}
const ChatCompo = () => {


    const Names = ["Genesis", "Origins", "Echo", "Whisper", "Now"];


    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <button className="version-selector-button" onClick={toggleDropdown}>
                <div className = "versionI">
                    <p> Version</p>
                </div>
                <div className = "versionIcon">
                    <i className = "fa-solid fa-angle-down" id = "milf"> </i>
                </div>
            </button>
            {isOpen && (
                <div className="dropdown" >
                    {Names.map(name => <ul style={{display: 'inline'}}> {name}</ul>)}
                </div>
            )}
        </div>
    )
}


export default ChatCompo