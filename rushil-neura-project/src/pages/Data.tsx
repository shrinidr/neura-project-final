
import SideBar from "../components/Sidebar"
import Header from "../components/header"
import PlotComponent from "../components/plot"


const DataPage = () => {


    return (
        <div>
        <Header/>
        <SideBar/>
        <div className = "main_content">
        <PlotComponent url= "http://127.0.0.1:5000/chp" />
        <PlotComponent url= "http://127.0.0.1:5000/words" />
        <PlotComponent url="http://127.0.0.1:5000/dailyhappyplot" />
        <PlotComponent url= "http://127.0.0.1:5000/stress" />
        </div>
        </div>
    )
}

export default DataPage