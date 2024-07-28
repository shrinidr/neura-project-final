import Header from "../components/header"
import SideBar from "../components/Sidebar"
import axios from "axios";
import DateDisplay from "../components/dateCompo";
import CalenderIcons from "../components/calender";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface Item{
    content: string;
    id: string;
}
interface Props {
    items: Item[];
}


const PrevPage = () => {

     interface Item {
        content: string;
        id: string;
    }

    const [currleft, changeLeft] = useState<number>(0);
    const [respDataState, respDataChange] = useState<Item[]>([]);

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


    const getNthPreviousDate  = (currleft: number) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - currleft);
        return currentDate.toISOString().split('T')[0];
    }

    const displayContentLeft = async () => {
        changeLeft(currleft+1)
        const date = getNthPreviousDate(currleft)
        try{
            const CalResponse = await axios.get('http://localhost:5000/api/getItems', {
                params: {date}
            })
            respDataChange(CalResponse.data);
        }
        catch(error){
            console.log("You have a drinking problem", error)
        }
    }
    useEffect(() => {
    displayContentLeft();
  }, []);
    const TextStuff: Item[] = [{id: "input1", content: "How was your day (In one sentence)?"},
        {id: "input2", content: "How many times did you feel like smashing a wall?"},
        {id: "input3", content: "How many times did you feel like dancing with said wall?" },
        {id: "input4", content: "How much did you exercise?"},
        {id: "input5", content: "How is your stress situation?"},
        {id: "input6", content: "Did you do anything that isn't part of your regular day?"},
        {id: "input7", content: "Any other thing that you think is worth remembering?"}

    ]

    return (
        <>
        <Header/>
        <SideBar/>
        <div className="main_content" ref={mainContentRef}>
            <div className="head">
                <img src="/sunny-day (1).png" id="day-icon" />
                <DateDisplay/>
                <CalenderIcons/>
            </div>
              {respDataState.map((item) => (
          <textarea
            className="textarea"
            id={item.id}
            key={item.id}
            value = {item.content || ''}
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