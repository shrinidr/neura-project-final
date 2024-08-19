
import axios from "axios";
import { useState, useEffect } from "react"

interface NameArray{

    font: string;
    name: String

}


{/* Lets just assume for now that we have exactly 5 models equally distributed between all the time
    that user data has been entered for simplicity purposes*/}
const ChatCompo = () => {


    const Names: NameArray[] = [{font: "fa-solid fa-mountain", name: "Genesis"},
                    {font: "fa-solid fa-puzzle-piece", name: "Origins"},
                    {font: "fa-solid fa-leaf", name: "Echo"},
                    {font: "fa-solid fa-mitten", name: "Whisper"},
                    {font: "fa-solid fa-volcano", name: "Now"}];



    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () =>{
        setIsOpen(!isOpen)
    }
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdownElement = document.querySelector('.dropdown-container');
            const buttonElement = document.querySelector('.version-selector-button');

            if (dropdownElement && buttonElement && !dropdownElement.contains(event.target as Node) && !buttonElement.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        // Add event listener for clicks
        document.addEventListener('click', handleClickOutside);

    }, []);



    const [versionData, setVersionData] = useState<boolean>(false)
    const [vData, vDataSet] = useState<String>('')
    const changedForm = (name: String) => {
        setVersionData(true)
        vDataSet(name)
    }

    useEffect(()=> {

        const sendData = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/version_input', { input: vData });
            console.log(response);
        } catch (error) {
            console.error(`i hate my life ${error}`);
        }
    };

    if (vData) {
        sendData();
    }

    }, [vData])

    return (
        <>
        {!versionData?(
            <>
                <button className="version-selector-button" onClick={toggleDropdown}>
                    <div className = "versionI">
                        <p> Version</p>
                    </div>
                    <div className = "versionIcon">
                        <i className = "fa-solid fa-angle-down" id = "milf"> </i>
                    </div>
                </button>
                {isOpen &&
                <div className={`dropdown-container ${isOpen ? 'open' : ''}`}>
                    <div className="dropdown">
                    {Names.map((item, index) => (
                        <button className="dropdown-item" onClick= {() => changedForm(item.name)}>
                            <span className="name">{item.name}</span>
                            <i className={item.font} id = "versionIconS"></i>
                        </button>
                    ))}
                    </div>
                </div>}
                </>):
                <div style = {{display: 'flex'}}>
                    <i className ="fa-solid fa-arrow-left" style = {{left: '2.8%', top: '6.2%', cursor: 'pointer'}}
                    onClick={() => setVersionData(false)}></i>
                    <i className="fa-regular fa-circle fa-xs" style={{right: '13%', top: '6.2%'}}></i>
                    <span className = "arbit"><b> {vData} </b></span>
                </div>}
        </>

    )
}


export default ChatCompo