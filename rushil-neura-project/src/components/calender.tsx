
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Link, useNavigate } from 'react-router-dom';
import { ChangeEvent } from "react";
import React from "react";

const CalenderIcons = () => {
    interface Item {
        content: string;
        id: string;
    }

    const [currleft, changeLeft] = useState<number>(0);
    const [respDataState, respDataChange] = useState<Item[]>([]);
    const navigate = useNavigate();

    const getNthPreviousDate  = (currleft: number) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - currleft);
        return currentDate.toISOString().split('T')[0];
    }

    const displayContentLeft = async () => {
        changeLeft(currleft+1)
        const date = getNthPreviousDate(currleft)
        try{
            const CalResponse = await axios.get<Item[]>('http://localhost:5000/api/getItems', {
                params: {date}
            })
            respDataChange(CalResponse.data);
        }
        catch(error){
            console.log("You have a drinking problem", error)
        }
    }
    const [calDate, calDateChange] = useState<string>('');

    const handleCalChange = () => {
        if(calDate){
                navigate(`/prev?date=${calDate}`);
        }

    }
    const changeCalVal = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        calDateChange(val);
    }
    const leftClicker  = () => {
        changeLeft(currleft+1)
    }

    useEffect(() => {
        displayContentLeft()
    }, [currleft])

    useEffect(() => {
        handleCalChange();
    }, [calDate])
    return (
        <>
        <Link to = "/prev" state = {{respDataState}}>
        <button className = "left_button_home" onClick={leftClicker}>
        <div className = "box" id = "first_box">
            <FontAwesomeIcon icon = {faChevronLeft}  id = "left"/>
        </div>
        </button>
        </Link>
        <button className= "disabled-button" disabled >
            <div className = "box" id = "second_box" >
                <FontAwesomeIcon icon = {faChevronRight} id = "right" />
            </div>
        </button>
        <button className = "cal_button">
        <div className = "box" id = "third_box">
            <input type = "date" id = "cal" value = {calDate} onChange = {changeCalVal} className = "date-input"></input>
        </div>
        </button>
        </>
    )
}

export default CalenderIcons;
