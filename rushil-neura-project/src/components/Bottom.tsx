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
                            <h2 className="BoxOne">Who Are We?</h2>
                            <div className="package">
                            <p style={{ lineHeight: '19px' }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <br />
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. <br />
                            </p>
                                <Link to="/home">
                                    <button className="btn" type="button">
                                        <strong> Filler </strong>
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
                                Two roads diverged in a yellow wood <br />
                                And sorry I could not travel both <br />
                                And be one traveler, long I stood <br />
                                And looked down one as far as I could <br />
                            </p>
                                <Link to="/home">
                                    <button className="btn" type="button">
                                        <strong> Filler </strong>
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
                    <p>&copy; 2024 Your Company Name </p> 
                    <p>All rights reserved.</p>
                    <div className="footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/contact">Contact</Link> 
                        <Link to="/blog">Blog</Link>
                        <Link to="/phonenumber">Call Us</Link>
                        <Link to="/email">Email Us</Link>
                    </div>
                </div>
            </footer>

        </div>
    );
}

export default Bottom;
