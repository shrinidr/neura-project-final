

import { Link } from 'react-router-dom';

const SideBar = () => {
    return (
        <>
        <div className="sidebar"> <br />
            <Link to = '/home'><i className="fa-solid fa-meteor"></i> </Link>
            <p> <Link to = '/home'> Home </Link> <br /><br />
            <Link to = '/insights'> <i className="fa-brands fa-uncharted" id="gear"></i> Insights </Link> <br/><br/>
            <Link to = '/chat'> <i className="fa-solid fa-ethernet" id = "Chat"></i> You.AI </Link>
            </p>

        </div>
        </>
    )
}

export default SideBar