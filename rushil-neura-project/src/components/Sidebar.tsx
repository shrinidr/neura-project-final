



import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar/sidebar.css" // Create this CSS file

const SideBar = () => {

  const location = useLocation();

  // Map of paths to sidebar items
  const navItems = [
    { path: "/home", icon: "fa-solid fa-meteor", text: "Home" },
    { path: "/insights", icon: "fa-brands fa-uncharted", text: "Insights" },
    { path: "/chat", icon: "fa-solid fa-ethernet", text: "aiNA" },
    { path: "/more_insights", icon: "fa-solid fa-head-side-virus", text: "Health" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {navItems.map((item) => (
          <Link
            to={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            key={item.path}
          >
            <i className={`${item.icon} sidebar-icon`}></i>
            <span className="sidebar-text">{item.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
