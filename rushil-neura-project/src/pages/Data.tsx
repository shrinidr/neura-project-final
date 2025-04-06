
import SideBar from "../components/Sidebar"
import Header from "../components/header"
import PlotComponent from "../components/plot"
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";


const DataPage = () => {

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
        <div>
        <Header/>
        <SideBar/>
        <div className="main_content" ref={mainContentRef}>
        <div className="head">
            <p className='data_head'> You,  visualized </p>
        </div>
        <PlotComponent url =  {`${import.meta.env.VITE_PYTHON_BACKEND_URL}/chp`} />
        <PlotComponent url =  {`${import.meta.env.VITE_PYTHON_BACKEND_URL}/words`} />
        <PlotComponent url =  {`${import.meta.env.VITE_PYTHON_BACKEND_URL}/dailyhappyplot`} />
        <PlotComponent url =  {`${import.meta.env.VITE_PYTHON_BACKEND_URL}/stress`} />
        {/*<PlotComponent url= "http://127.0.0.1:5001/words" />
        <PlotComponent url="http://127.0.0.1:5001/dailyhappyplot" />
        <PlotComponent url=  "http://127.0.0.1:5001/stress" />*/}
        {!isAtBottom &&
        (<div className="scroll-bottom" onClick = {scrollToBottom}>
                <i className="fa-solid fa-arrow-down" ></i> </div>)
        }
        </div>
        </div>
    )
}

export default DataPage