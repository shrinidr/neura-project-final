

import { Link } from "react-router-dom";

const Footer = () => {
    return (<div>
                <footer className="footer">
                <div className="footer-content">
                <div style = {{marginLeft: '-20px'}}>
                    <img src="/neura-removebg-preview.png" style={{marginRight: '6px'}} />
                    <Link to ='/'>  <p id="title" style = {{marginLeft: '0px'}}><b> Neura </b> </p> </Link> 
                </div>
                    <div className="footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/contact-us">Contact</Link>
                    </div>
                </div>
            </footer>
            </div>)
}

export default Footer;