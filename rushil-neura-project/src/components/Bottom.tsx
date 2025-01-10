import { Link } from 'react-router-dom';

interface Props {
    text1: string;
    text2: string;
    text3: string;
    text4: string;
}

const Bottom = ({ text1, text2, text3, text4 }: Props) => {
    return (
        <div className="bottom-section">
            <img className="BackgroundImage" src="/backg.jpg" />
            <div className="PageTwo">
                <h2 className="SecondHeader">What do we do?</h2>
                <div className="package">
                    <p style={{ lineHeight: '19px' }}>
                        {text1} <br /> {text2} <br /> {text3} <br /> {text4}
                    </p>
                    <Link to="/home">
                        <button className="btn" type="button">
                            <strong> Start Now</strong>
                            <div id="container-stars">
                                <div id="stars"></div>
                            </div>
                            <div id="glow">
                                <div className="circle"></div>
                                <div className="circle"></div>
                            </div>
                        </button>
                    </Link>
                </div>
                <div className="LinkBox">
                    <div className="row">
                        <div className="section">
                            <h2 className="BoxOne">But what exactly?</h2>
                            <div className="package">
                            <p style={{ lineHeight: '19px' }}>
                                Track your mental health using our insights section. <br />
                                Have a problem? Talk to yourself from the past and figure it out! <br />
                                Fitness data too complex? We gotchu. Read your data like a story and make actual sense of it to take actionable steps to fix your problems. <br />
                            </p>
                                <Link to="/home">
                                    <button className="btn" type="button">
                                        <strong> Talk to yourself. </strong>
                                        <div id="container-stars">
                                            <div id="stars"></div>
                                        </div>
                                        <div id="glow">
                                            <div className="circle"></div>
                                            <div className="circle"></div>
                                        </div>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="section">
                            <h2 className="BoxTwo">Our Mission</h2>
                            <div className="package">
                            <p style={{ lineHeight: '19px' }}>
                                We help you bring together <br />
                                your mental and physical health <br />
                                all in one place. <br />
                                To help you understand yourself in powerful ways.<br />
                                That totally did not rhyme.
                            </p>
                                <Link to="/home">
                                    <button className="btn" type="button">
                                        <strong> About Us </strong>
                                        <div id="container-stars">
                                            <div id="stars"></div>
                                        </div>
                                        <div id="glow">
                                            <div className="circle"></div>
                                            <div className="circle"></div>
                                        </div>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; 2024 Neura</p>
                    <p>All rights reserved.</p>
                    <div className="footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/email">Email Us</Link>
                    </div>
                </div>
            </footer>

        </div>
    );
}

export default Bottom;
