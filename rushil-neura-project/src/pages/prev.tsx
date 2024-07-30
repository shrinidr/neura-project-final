import Header from "../components/header"
import SideBar from "../components/Sidebar"
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Item{
    content: string;
    id: string;
}
interface Props {
    items: Item[];
}

interface Entry {
  id: string;
  content: string;
}

interface Data {
  date: string;
  entries: Entry[];
}

const PrevPage = () => {

     interface Item {
        content: string;
        id: string;
    }

    const [currleft, changeLeft] = useState<number>(0);
    const [respDataState, respDataChange] = useState<Item[]>([]);
    const [isRightButtonDisabled, setIsRightButtonDisabled] = useState<boolean>(false);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const [currentDate, setCurrentDate] = useState<string>('');

    const dateManipulation = () => {
        const dateString = getNthPreviousDate(currleft);
        const finalDate = formatDate(dateString)
        setCurrentDate(finalDate);
    }

    const formatDate = (dateStr: string) => {
    const dateString = dateStr.toString();
    // Split the input date string and create a Date object
    const [year, month, day] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    // Array of weekday and month names
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get the day of the week and month day
    const weekday = weekdays[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayOfMonth = date.getDate();

    // Format the date string
    return `${weekday}, ${monthName} ${dayOfMonth}`;
}

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


    const getNthPreviousDate  = (currleft: number) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - currleft);
        return currentDate.toISOString().split('T')[0];
    }

    const lefterClick = () => {
      changeLeft(currleft+1)
    }
    const displayContent = async (offset: number) => {
        const date = getNthPreviousDate(offset)
        try{
            const CalResponse = await axios.get('http://localhost:5000/api/getItems', {
                params: {date}
            })
            respDataChange(CalResponse.data);
        }
        catch(error){
            console.log("You have a drinking problem", error)
        }
        setIsRightButtonDisabled(isToday(date));
        dateManipulation();
    }

    useEffect(() => {
    displayContent(currleft);
    }, [currleft]);

    useEffect(() => {
        displayContent(currleft);
    }, []);

    const TextStuff: Item[] = [{id: "input1", content: "How was your day (In one sentence)?"},
        {id: "input2", content: "How many times did you feel like smashing a wall?"},
        {id: "input3", content: "How many times did you feel like dancing with said wall?" },
        {id: "input4", content: "How much did you exercise?"},
        {id: "input5", content: "How is your stress situation?"},
        {id: "input6", content: "Did you do anything that isn't part of your regular day?"},
        {id: "input7", content: "Any other thing that you think is worth remembering?"}

    ]
    const righterClick = () => {
        changeLeft(currleft-1)
    }
    const isToday = (dateStr: string) => {
    const today = new Date();
    const [year, month, day] = dateStr.split("-");
    const dateToCheck = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return today.toDateString() === dateToCheck.toDateString();
  };
    return (
        <>
        <Header/>
        <SideBar/>
        <div className="main_content" ref={mainContentRef}>
            <div className="head">
                <img src="/sunny-day (1).png" id="day-icon" />
                <div id="date-container">{currentDate}</div>
                <button className = "left_button" onClick={lefterClick}>
                    <div className = "box" id = "first_box">
                        <FontAwesomeIcon icon = {faChevronLeft}  id = "left"/>
                    </div>
                </button>
                <button className={`right_button button ${isRightButtonDisabled ? "disabled-button" : ""}`} onClick = {righterClick} disabled = {isRightButtonDisabled}>
                    <div className = "box" id = "second_box" >
                        <FontAwesomeIcon icon = {faChevronRight} id = "right" />
                    </div>
                </button>
                <button className = "cal_button">
                    <div className = "box" id = "third_box">
                        <input type = "date" id = "cal" className = "date-input"></input>
                    </div>
                </button>
            </div>
              {respDataState.map((item) => (
          <textarea
            className="textarea"
            id={item.id}
            key={item.id}
            value = {item.content || ''}
            readOnly
          />
        ))}
        {!isAtBottom &&
        (<div className="scroll-to-bottom" onClick = {scrollToBottom}>
                <i className="fa-solid fa-arrow-down" ></i> </div>)
       }

        <button className = "submitButtonDead">Submitted</button>
        </div>
        </>
    )
}

export default PrevPage;