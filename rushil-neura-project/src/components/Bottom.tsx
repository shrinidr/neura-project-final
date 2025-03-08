import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook

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
                        <img src="/testdisplay.png" alt="Image 1" />
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
                        <img src="/testdisplay.png" alt="Image 2" />
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
                    <div className="image-gap left-gap">
                        <img src="/testdisplay.png" alt="Image 3" />
                    </div>
                </div>
            </div>

            {/*<footer className="footer">
                <div className="footer-content">
                    <p> Neura</p>
                    <div className="footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/contact-us">Contact</Link>
                        <Link to="/email">Email Us</Link>
                    </div>
                </div>
            </footer>*/}

<div style={{width: 1440, height: 479, position: 'relative'}}>
  <img style={{width: 1440, height: 479, left: 0, top: 0, position: 'absolute', background: 'linear-gradient(0deg, black 0%, black 100%)'}} src="https://placehold.co/1440x479" />
  <div style={{width: 1280.50, height: 244, left: 80, top: 169, position: 'absolute'}}>
    <div style={{left: NaN, top: NaN, position: 'absolute'}}>
      <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
      <div style={{left: NaN, top: NaN, position: 'absolute'}}>
        <div style={{left: NaN, top: NaN, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
          <div style={{left: 'undefined', top: 'undefined', position: 'absolute', background: 'white'}} />
          <div style={{left: 'undefined', top: 'undefined', position: 'absolute', background: 'white'}} />
        </div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
      </div>
      <div style={{left: NaN, top: NaN, position: 'absolute'}}>
        <div style={{left: NaN, top: NaN, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
          <div style={{left: 'undefined', top: 'undefined', position: 'absolute', background: 'white'}} />
        </div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
      </div>
      <div style={{left: NaN, top: NaN, position: 'absolute'}}>
        <div style={{left: NaN, top: NaN, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
          <div style={{left: 'undefined', top: 'undefined', position: 'absolute', background: 'white'}} />
          <div style={{left: 'undefined', top: 'undefined', position: 'absolute'}} />
        </div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
      </div>
    </div>
    <div style={{left: NaN, top: NaN, position: 'absolute'}}>
      <div style={{left: NaN, top: NaN, position: 'absolute'}}>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
      </div>
      <div style={{left: NaN, top: NaN, position: 'absolute'}}>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
      </div>
      <div style={{left: NaN, top: NaN, position: 'absolute'}}>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
        <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
      </div>
    </div>
    <div style={{left: NaN, top: NaN, position: 'absolute', border: '1px white solid'}} />
    <div style={{left: NaN, top: NaN, position: 'absolute', background: '#131313', borderRadius: 10}} />
    <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
    <div style={{left: NaN, top: NaN, position: 'absolute', opacity: 0.50}}></div>
    <div style={{left: NaN, top: NaN, position: 'absolute', background: '#1E1E1E', borderRadius: 4}} />
    <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
    <div style={{left: NaN, top: NaN, position: 'absolute', background: 'black'}} />
    <div style={{left: NaN, top: NaN, position: 'absolute'}}></div>
  </div>
</div>

        </div>
    );
}

export default Bottom;
