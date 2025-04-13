import {useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook
import "../styles/HomePage/bottom.css";
interface Props {
    text1: string;
    text2: string;
    text3: string;
    text4: string;
}


const Bottom = ({ text1, text2, text3, text4 }: Props) => {
    const navigate = useNavigate();
    const {isSignedIn } = useUser();
    const buttonHandle = () => {
        
        if (!isSignedIn) {
            navigate("/sign-in");
        }
        else{
            navigate("/home");
        }
    }
    const buttonHandle2 = () => {
        
        if (!isSignedIn) {
            navigate("/sign-in");
        }
        else{
            navigate("/chat");
        }
    }
     
    const buttonHandle3 = () => {
        
        if (!isSignedIn) {
            navigate("/sign-in");
        }
        else{
            navigate("/contact-us");
        }
    }
    
    return (
        <div className="bottom-section">
            <img className="BackgroundImage" src="/backg.jpg" alt="Background" />
            <div className="PageTwo">
                
                <div className="row">
                    <div className="section left">
                        <h2 className="SecondHeader">What we do</h2>
                        <div className="package">

                            <p style={{ lineHeight: '19px' }}>
                                {text1}  {text2}  {text3}  {text4}
                            </p>

                                <button className="btn" type="button" onClick={buttonHandle}>
                                    <strong> Start Now</strong>
                                    <div id="container-stars">
                                        <div id="stars"></div>
                                    </div>
                                    <div id="glow">
                                        <div className="circle"></div>
                                        <div className="circle"></div>
                                    </div>
                                </button>
                        </div>
                    </div>
                    <div className="image-gap left-gap">
                        <img src="/Screenshot 2025-03-29 211616.png" alt="Image 1" />
                    </div>
                </div>

                <div className="row">
                    <div className="section right">
                        <h2 className="BoxOne">But what exactly?</h2>
                        <div className="package">
                            <p style={{ lineHeight: '19px' }}>

                                Track your mental health using our insights section. 
                                Have a problem? Talk to yourself from the past and figure it out! 
                                Fitness data too complex? We gotchu. Read your data like a story and make actual sense of it to take actionable steps to fix your problems.

                            </p>

                                <button className="btn" type="button" onClick={buttonHandle2}>
                                    <strong >Talk to yourself</strong>
                                    <div id="container-stars">
                                        <div id="stars"></div>
                                    </div>
                                    <div id="glow">
                                        <div className="circle"></div>
                                        <div className="circle"></div>
                                    </div>
                                </button>
                        </div>
                    </div>
                    <div className="image-gap right-gap">
                        <img src="/Happinesscard.png" alt="Image 2" />
                    </div>
                </div>

                <div className="row">
                    <div className="section left">
                        <h2 className="BoxTwo">Our Mission</h2>
                        <div className="package">
                            <p style={{ lineHeight: '19px' }}>
                                We help you bring together 
                                your mental and physical health 
                                all in one place. 
                                To help you understand yourself in powerful ways.
                                That totally did not rhyme.
                            </p>

                                <button className="btn" type="button" onClick={buttonHandle3}>
                                    <strong> About Us </strong>
                                    <div id="container-stars">
                                        <div id="stars"></div>
                                    </div>
                                    <div id="glow">
                                        <div className="circle"></div>
                                        <div className="circle"></div>
                                    </div>
                                </button>
                        </div>
                    </div>
                    <div className="ma-la la-ma" >
                        <img src="/thirdOne.png" alt="Image 3"
                        style={{
                            width: 'auto',
                            maxHeight: '70vh',  // Adjust this value as needed
                            maxWidth: '100%',
                            height: 'auto'
                          }}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bottom;
