
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
const Calender = () => {

    return (
        <>
        <div className = "box" id = "first_box">
            <FontAwesomeIcon icon = {faChevronLeft}  id = "left"/>
        </div>
        <div className = "box">
            <FontAwesomeIcon icon = {faChevronRight} id = "right" />
        </div>
        <div className = "box">
            <FontAwesomeIcon icon={faCalendarDays} id = "cal" />
        </div>
        </>
    )
}

export default Calender;
