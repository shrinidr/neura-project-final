
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { ChangeEvent } from "react";
import { useUser } from "@clerk/clerk-react";

const CalenderIcons = () => {
    interface Item {
        content: string;
        id: string;
    }

    const { user, isSignedIn } = useUser();
    const [currleft, changeLeft] = useState<number>(0);
    const [respDataState, respDataChange] = useState<Item[]>([]);
    const [skipInitialFetch, setSkipInitialFetch] = useState(true);  // New flag
    const [isFetching, setIsFetching] = useState(false);  // Debounce flag

    const navigate = useNavigate();

    const getNthPreviousDate  = (currleft: number) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - currleft);

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const day = String(currentDate.getDate()).padStart(2, '0');
        const answer = `${year}-${month}-${day}`;
        return answer;
    }

    const displayContentLeft = async () => {
        //changeLeft(currleft+1)
         if (isFetching || !isSignedIn || !user) return;  // Skip if already fetching
        setIsFetching(true);  // Set fetching to true
        const date = getNthPreviousDate(currleft)
        try{

            const CalResponse = await axios.get<Item[]>('http://localhost:5000/api/getItems', {
                headers: { 'x-user-id': user.id },
                params: { date },
            })
            respDataChange(CalResponse.data);
        }
        catch(error){
            console.log("Seems to be some problem", error)
        } finally {
        setIsFetching(false);  // Reset fetching flag
    }
    }
    const [calDate, calDateChange] = useState<string>('');

    const handleCalChange = () => {
        if(calDate){
                navigate(`/prev`);
        }
//date=${calDate}
    }
    const changeCalVal = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        calDateChange(val);
    }

    const leftClicker = () => {
        changeLeft((prev) => prev + 1); // Only increment `currleft`
        setSkipInitialFetch(false);
    };

    // Trigger API call when `currleft` changes and user is authenticated
    useEffect(() => {
        if (user && !skipInitialFetch) {
            displayContentLeft();
        }
    }, [currleft, user, skipInitialFetch]);

    // Handle calendar date input change
    useEffect(() => {
        if (user) {
            handleCalChange();
        }
    }, [calDate, user]);

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
