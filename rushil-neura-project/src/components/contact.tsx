import "../styles/ContactPage/contactus.css";
const Contact = () => {
    return (
      <div className="contactcontainer">
        <div className="contactform">
          <div className="contact-info">
            <h3 className="letsgetintouch">Let's Get In Touch!</h3>
            <div className="info">
              <div className="information">
                <i className="fas fa-envelope" id = "gmailid"></i> &nbsp;&nbsp;
                <p> Please send your questions/suggestions/ideas/feedback etc to <a href="mailto:neurajournal@gmail.com" style = {{color: 'black'}}>neurajournal@gmail.com </a> </p>
              </div>
              </div>
  
            <div className="social-media">
              <p>Connect with us:</p>
              <div className="social-icons">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.linkedin.com/company/neurain/">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
  
          <div className="contact-form">
            <h3 className="letsgetintouch">Contact us</h3>
            <div className="input-container">
              <input type="text" className="input69" placeholder="First Name" disabled/>
              <input type="text" className="input69" placeholder="Last Name" disabled/>
            </div>
            <div className="input-container">
              <input type="email" className="input69" placeholder="Email" disabled/>
            </div>
            <div className="input-container">
              <input type="tel" className="input69" placeholder="Phone" disabled />
            </div>
            <div className="input-container textarea">
              <textarea className="input69" placeholder="Tell us what we can help you with" disabled></textarea>
            </div>
            <button className="contactbtn" type="button">Send</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Contact;
  