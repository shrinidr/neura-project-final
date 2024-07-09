

import { Link } from 'react-router-dom';

const SideBar = () => {
    return (
        <>
        <div className="sidebar"> <br />
            <Link to = '/home'><i className="fa-solid fa-house"></i> </Link>
            <p> <Link to = '/home'> Home </Link> <br /><br />
            <Link to = '/insights'> <i className="fa-solid fa-gears" id="gear"></i> Insights </Link></p>
        </div>
        </>
    )
}

export default SideBar