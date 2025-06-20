import { useState } from "react";
import { useRef } from "react";
import DateDisplay from "./dateCompo";
import axios from "axios";
import { useEffect } from "react";
import CalenderIcons from "./calender";
import { useUser } from "@clerk/clerk-react";
import APISButton from "./apisButt";
import { useAuth } from "@clerk/clerk-react";
interface Item{
    content: string;
    id: string;
}

interface Props {
    items: Item[];
}

const TextArea = (data: Props) => {
  const {getToken} = useAuth();
  
  const { user, isSignedIn } = useUser();
  //destructuring an array []
    const [formData, setFormData] = useState<{[key: string]: string}>({});
    //the type of the state is defined within the <> which is basically that the keys are strings and so are the
    //values.
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
};  

const [isSubmitted, setIsSubmitted] = useState(false);


    const bitch  = (currleft: number) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - currleft);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const day = String(currentDate.getDate()).padStart(2, '0');
        const answer = `${year}-${month}-${day}`;
        return answer;
    }

  // Handle textarea blur (when cursor leaves the textarea)
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      //e.target is the value of the text input given by the user.
    const { id, value } = e.target; //the id is basically "inputx" as defined in our code.

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async () =>{

  try{
    if (!isSignedIn || !user) return;
    const formattedDate = bitch(0);
    setIsSubmitted(true);
    //console.log(user)
    //console.log("Submitting data:", { formData, date: formattedDate }); // Debug log
    const token = await getToken();
    await axios.post( `${import.meta.env.VITE_BACKEND_URL}/api/data`,
      { formData, formattedDate },  // The data payload
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
        },
      }
    );

    console.log("Data submitted successfully.")
    // In your React component after saving a new entry 
    await axios.post( `${import.meta.env.VITE_PYTHON_BACKEND_URL}/refreshCache`, {}, {
    headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Cache Changes Made in redis");

    
  }catch(error){
    //console.log(`Error: ${error}`)
  }

  };
  //all of this to ensure that the arrow disappears when we scroll to the bottom.
  //Refer for more info on this: https://chatgpt.com/c/1208451f-c9c6-4b92-b6dd-48f437c89757


  const mainContentRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollToBottom = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = mainContentRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (mainContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = mainContentRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight);
    }
  };

  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  
    return (
        <>
        <div className="main_content" ref={mainContentRef}>
            <div className="head">
                <img src="/sunny-day (1).png" id="day-icon" />
                <DateDisplay/>
                <CalenderIcons/>
            </div>
            <APISButton/>
              {data.items.map((item) => (
          <textarea
            className="textarea"
            id={item.id}
            key={item.id}
            placeholder={item.content}
            value={formData[item.id] || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus={item.id === "input1"}
          />
        ))}
        {!isAtBottom &&
        (<div className="scroll-to-bottom" onClick = {scrollToBottom}>
                <i className="fa-solid fa-arrow-down" ></i> </div>)
        }

<button
      className={isSubmitted ? "submitButtonDead" : "submitButtonMain"}
      onClick={handleSubmit}
      disabled={isSubmitted} // Disables the button after submission
      >
      {isSubmitted ? "Submitted" : "Submit All"}
    </button>
        </div>
        </>
    )
}

export default TextArea;