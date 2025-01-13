import React ,{useEffect ,useContext} from "react";
import { NavLink } from "react-router-dom";
import UserContext from "./UserContext";

const NavBar = () => {
 
  //get context
    let userContext=useContext(UserContext);
    
    //when the user clicks on logout button
    let onLogoutClick = (event) => {
      event.preventDefault();

      //dispatch calls reducer
      userContext.dispatch({
        type: "logout",
      });
      
      window.location.hash = "/";
    };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-style ps-3 pe-3">
      <a className="navbar-brand" href="/#">
        eCommerce
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto">

        {userContext.user.isLoggedIn && userContext.user.currentUserRole === "user"? (
            <li className="nav-item">
              <NavLink              
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <i className="fa fa-dashboard"></i> Dashboard
              </NavLink>
            </li>
          ) : (
            ""
          )}

          { userContext.user.isLoggedIn && userContext.user.currentUserRole === "user"?(
            <li className="nav-item">
              <NavLink              
                to="/store"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <i className="fa fa-shopping-bag"></i> Store
              </NavLink>
            </li>
          ) : (
            ""
          )}
          { userContext.user.isLoggedIn && userContext.user.currentUserRole === "admin"?(
            <li className="nav-item">
              <NavLink              
                to="/products"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <i className="fa fa-suitcase"></i> Products
              </NavLink>
            </li>
          ) : (
            ""
          )}

       {!userContext.user.isLoggedIn ? (  
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Login
            </NavLink>
          </li>
       ):(
        ""
        )}
        {!userContext.user.isLoggedIn ? ( 
          <li className="nav-item">
            <NavLink
              to="/register"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Register
            </NavLink>
          </li>
        ):(
          ""
        ) }
        </ul>

        {/* right box starts */}
        {userContext.user.isLoggedIn ? ( 
        <div className="me-3">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa fa-user-circle"></i>{""} 
                {userContext.user.currentUserName}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="/#" onClick={onLogoutClick}>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
         ):(
           ""
           )}
        {/* right box ends */}
      </div>
    </nav>
  );
};

export default NavBar;

