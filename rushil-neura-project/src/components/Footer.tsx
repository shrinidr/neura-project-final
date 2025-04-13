

import { Link } from "react-router-dom";

const Footer = () => {
    return (<div>
                <footer className="footer">
                <div className="footer-content">
                <div>
                    <img src="/neura-removebg-preview.png" />
                    <Link to ='/'>  <p id="title"><b> Neura </b> </p> </Link> 
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