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
            </div>
        </div>
    );
}

export default Bottom;
