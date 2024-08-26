
import { Link } from 'react-router-dom';




const Header = () => {
    const button_ele = [{content: "About Us", id: "btn1"},{content: "AI", id: "btn2"},{content: "Login", id: "btn3"}];
    return (
        <>
        <div className="container">
                <img src="/neura-removebg-preview.png" />
                <Link to ='/'>  <p id="title"><b> Neura </b> </p> </Link>
                {button_ele.map((element) => (
                    <button className="Btn" id={element.id} key = {element.id}>{element.content}</button>
                ))}
        </div>
        </>
    );
}

export default Header;
