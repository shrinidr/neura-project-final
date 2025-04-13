

import { Link } from "react-router-dom";

const Footer = () => {
    return (<div>
                <footer className="footer">
                <div className="footer-content">
                <div>
                    <img src="/neura-removebg-preview.png" style={{marginRight: '6px'}} />
                    <Link to ='/'>  <p id="title" style = {{marginLeft: '0px'}}><b> Neura </b> </p> </Link> 
                </div>
                    <div className="footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/contact-us">Contact</Link>
                        <Link to="/email">Email Us</Link>
                    </div>
                </div>
            </footer>
            </div>)
}

export default Footer;