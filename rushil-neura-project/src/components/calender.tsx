
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";


const CalenderIcons = () => {

    const [currleft, changeLeft] = useState<number>(0);

    const getNthPreviousDate  = (currleft: number) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - currleft);
        return currentDate.toISOString().split('T')[0];
    }

    const displayContentLeft = async () => {
        changeLeft(currleft+1)
        const date = getNthPreviousDate(currleft)
        try{
            const response = await axios.get('http://localhost:5000/api/getItems', {
                params: {date}
            })

        }
        catch(error){
            console.log("You have a drinking problem", error)
        }
    }

    return (
        <>
        <button className = "left_button" onClick={displayContentLeft}>
        <div className = "box" id = "first_box">
            <FontAwesomeIcon icon = {faChevronLeft}  id = "left"/>
        </div>
        </button>
        <button className = "right_button">
        <div className = "box">
            <FontAwesomeIcon icon = {faChevronRight} id = "right" />
        </div>
        </button>
        <button className = "cal_button">
        <div className = "box">
            <input type = "date" id = "cal" className = "date-input"></input>
        </div>
        </button>
        </>
    )
}

export default CalenderIcons;
