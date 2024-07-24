
import SideBar from "../components/Sidebar"
import Header from "../components/header"
import PlotComponent from "../components/plot"


const DataPage = () => {


    return (
        <div>
        <Header/>
        <SideBar/>
        <div className = "main_content">
        <PlotComponent url="http://127.0.0.1:5000/dailyhappyplot" />

        </div>
        </div>
    )
}

export default DataPage