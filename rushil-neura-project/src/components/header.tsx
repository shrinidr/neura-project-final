
import { Link } from 'react-router-dom';




const Header = () => {
    const button_ele = [{content: "About Us", id: "btn1"},{content: "AI", id: "btn2"},{content: "Login", id: "btn3"}];
    return (
        <>
        <div className="container">
                <img src="/neura-removebg-preview.png" />
                <Link to ='/'>  <p id="title"><b> Neura </b> </p> </Link>
                <button className="Btn" id = "btn1" key = "btn1"> About Us</button>
                <button className="Btn" id=  "btn2" key = "btn2"> AI </button>
                <Link to = '/sign-in'><button className="Btn" id= "btn3" key = "btn3"> Login </button></Link>
        </div>
        </>
    );
}

export default Header;
