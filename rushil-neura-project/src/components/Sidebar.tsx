

import { Link } from 'react-router-dom';

const SideBar = () => {
    return (
        <>
        <div className="sidebar"> <br />

            <Link to = '/home'><i className="fa-solid fa-meteor" id = "HomeIcon"></i>  <p>Home</p> </Link>
            <Link to = '/insights'> <i className="fa-brands fa-uncharted" id="gear"></i> <p>Insights</p> </Link> 
            <Link to = '/chat'> <i className="fa-solid fa-ethernet" id = "ChatIcon"></i> <p>aiNA</p> </Link> 
            <Link to = '/more_insights'> <i className = "fa-solid fa-head-side-virus" id = "moreInsightsIcon"></i> <p className = "moreInsightsText"> Health</p> </Link>
            

        </div>
        </>
    )
}

export default SideBar