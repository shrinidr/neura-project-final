
import axios from "axios";
import { useState, useEffect } from "react"
import { useAuth } from "@clerk/clerk-react";
interface NameArray{
    font: string;
    name: String;
}

interface IconProps{
    iconDataProps: (data: string) => void,
    babyState: boolean,
    verValChange: (data: boolean) => void,
    inputChange: string
}


{/* Lets just assume for now that we have exactly 5 models equally distributed between all the time
    that user data has been entered for simplicity purposes*/}
const ChatCompo: React.FC<IconProps> = ({iconDataProps, babyState, verValChange, inputChange}) => {


    const {getToken} = useAuth();
    if(babyState){}
    const Names: NameArray[] = [{font: "fa-solid fa-mountain", name: "Genesis"},
                    {font: "fa-solid fa-puzzle-piece", name: "Origins"},
                    {font: "fa-solid fa-leaf", name: "Echo"},
                    {font: "fa-solid fa-mitten", name: "Whisper"},
                    {font: "fa-solid fa-volcano", name: "Now"}];



    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () =>{
        setIsOpen(!isOpen)
        verValChange(true)
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

    const changedForm = (name: String, icon: string) => {
        setVersionData(true)
        vDataSet(name)
        iconDataProps(icon)
    }

    useEffect(()=> {

        const sendData = async () => {
        try {
            const token = await getToken();
            const response = await axios.post(`${import.meta.env.VITE_PYTHON_BACKEND_URL}/version_input`, { input: vData },
                {
            headers: { Authorization: `Bearer ${token}` },
        });
            console.log(response)
        } catch (error) {
            console.error(`i hate my life ${error}`);
        }
    };

    if (vData) {
        sendData();
    }

    }, [vData])

    const [infoBut, setInfoBut] = useState<string | null>(null)
    const [genesisObj, genesisObjChange] = useState<{endDate: "", startDate: ""}>({endDate: "", startDate: ""})
    const [originsObj, originsObjChange] = useState<{endDate: "", startDate: ""}>({endDate: "", startDate: ""})





    const dateChanger = (dateString: string) =>{
            const date = new Date(dateString);
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long', // 'Monday'
                year: 'numeric', // '2024'
                month: 'long',   // 'July'
                day: 'numeric'   // '22'
            };

            return date.toLocaleDateString('en-US', options);

        }
    const findVersionData = async () => {
        try{
            const token = await getToken();
            //http://127.0.0.1:5002/datesFind
            const response = await axios.get(`${import.meta.env.VITE_PYTHON_BACKEND_URL}/datesFind`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            //console.log(response)
            genesisObjChange(response.data.response["Genesis"])
            originsObjChange(response.data.response["Origins"])
        }
        catch (error){
            console.error(`The error is ${error}`)
        }
    }
    useEffect(()=>{
        findVersionData()
    }, [])

    return (
        <>
        {!versionData?(
            <>
                <i className ="fa-solid fa-circle-info" id = "infoButton"
                onMouseEnter = {() => setInfoBut("infoToolTip")}
                onMouseLeave = {() => setInfoBut(null)}></i>
                {infoBut && <div className = {infoBut}>
                    The five "versions" we have created have been uniformly trained over all your data. That is, Genesis corresponds
                    to "You" from {dateChanger(genesisObj.startDate)} to {dateChanger(genesisObj.endDate)},
                    Origins from {dateChanger(originsObj.startDate)} to {dateChanger(originsObj.endDate)} and so on. Choose your version to start the conversation.
                    </div> }
                <button className="version-selector-button" onClick={toggleDropdown}>
                    <div className = "versionI">
                        <p> Version</p>
                    </div>
                    <div className = "versionIcon">
                        <i className = "fa-solid fa-angle-down" id = "milf"> </i>
                    </div>
                </button>
                <div className = "chatHeading">
                <h1 className = "arbitrarystuff" > have a look at how far you've come, talk to yourself.</h1>
                </div>
                {isOpen &&
                <div className={`dropdown-container ${isOpen ? 'open' : ''}`}>
                    <div className="dropdown">
                    {Names.map((item, index) => (
                        <button key={index} className="dropdown-item" onClick= {() => changedForm(item.name, item.font)}>
                            <span className="name">{item.name}</span>
                            <i className={item.font} id = "versionIconS"></i>
                        </button>
                    ))}

                    </div>
                </div>}
                </>):
                <div style = {{display: 'flex'}} >
                    <i className ="fa-solid fa-arrow-left" style = {{left: '2.8%', top: '6.2%', cursor: 'pointer'}}
                    onClick={() =>{
                        setVersionData(false)
                        verValChange(false)
                        }}></i>
                    <i className="fa-regular fa-circle fa-xs" style={{right: '13%', top: '4.8vh'}}></i>
                    <span className = "arbit"><b> {vData} </b></span>
                    {inputChange==''?
                    <div className="terminal-loader">
                        <div className="terminal-header">
                            <div className="terminal-title">Status</div>
                            <div className="terminal-controls">
                                <div className="control close"></div>
                                <div className="control minimize"></div>
                                <div className="control maximize"></div>
                            </div>
                        </div>
                        <div className="text"> Say something...</div>
                    </div>:<div/>}

                </div>
                }


        </>

    )
}


export default ChatCompo