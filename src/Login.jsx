import React, { useState, useEffect ,useContext,useRef} from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";

let Login = (props) => {
  var [email, setEmail] = useState("admin@test.com");
  var [password, setPassword] = useState("Admin123");
  
  let myEmailRef = useRef();

  let [dirty, setDirty] = useState({
    email: false,
    password: false,
  });

  let [errors, setErrors] = useState({
    email: [],
    password: [],
  });


 //CREATED VARIABLE
  let userContext=useContext(UserContext);
 
  

  let [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();
  //executes on each render (initial render & state updates)
  useEffect(() => {
    //console.log(email, password);
  });

  //executes only on state updates of "email" only (and also with initial render)
  useEffect(() => {
    //validation on email only
    if (email.indexOf("@") > 0) {
      //console.log("valid");
    } else {
      //console.log("invalid");
    }
  }, [email]);

  //executes only once - on initial render =  componentDidMount
  useEffect(() => {
    document.title = "Login - eCommerce";
    myEmailRef.current.focus();
  }, []);

  //executes only once - on component unmounting phase = componentWillUnmount
  useEffect(() => {
    //do something
    return () => {
      // console.log("Component Unmount");
    };
  }, []);

  //a function to validate email and password
  let validate = () => {
    //variable to store errorsData
    let errorsData = {};

    //email
    errorsData.email = [];

    //email can't blank
    if (!email) {
      errorsData.email.push("Email can't be blank");
    }

    //email regex
    let validEmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (email) {
      if (!validEmailRegex.test(email)) {
        errorsData.email.push("Proper email address is expected");
      }
    }

    //password
    errorsData.password = [];

    //password can't blank
    if (!password) {
      errorsData.password.push("Password can't be blank");
    }

    //password regex
    let validPasswordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
    if (password) {
      if (!validPasswordRegex.test(password)) {
        errorsData.password.push(
          "Password should be 6 to 15 characters long with at least one uppercase letter, one lowercase letter and one digit"
        );
      }
    }

    setErrors(errorsData);
  };

  useEffect(validate, [email, password]);

  //When the user clicks on Login button
  let onLoginClick = async (e) => {
    e.preventDefault(); // Prevent form submission until validation is complete
  
    // Set all controls as dirty by creating a new object
    let dirtyData = { ...dirty }; // Create a copy of the current dirty state
    Object.keys(dirtyData).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData); // Update state with the new dirty state
    console.log(dirtyData, "dirty");
  
    // Call validate
    validate();
  
    // Wait until validation is complete before proceeding
    if (isValid()) {
      try {
        let response = await fetch(
          `http://localhost:5000/users?email=${email}&password=${password}`,
          { method: "GET" }
        );
        if (response.ok) {
          // Status code is 200
          let responseBody = await response.json();
  
          // Set global state using context
          if (responseBody.length > 0) {
            userContext.dispatch({ type: "somework", payload: { x: 10, y: 20 } });
  
            // Dispatch calls reducer
            userContext.dispatch({
              type: "login",
              payload: {
                currentUserName: responseBody[0].fullName,
                currentUserId: responseBody[0].id,
                currentUserRole: responseBody[0].role,
              },
            });
  
            // Redirect to relevant page based on role of the user received in the response
            if (responseBody[0].role === "user") {
              // Redirect to /dashboard
              navigate("/dashboard");
            } else {
              // Redirect to /products
              navigate("/products");
            }
          } else {
            setLoginMessage(
              <span className="text-danger">Invalid Login, please try again</span>
            );
          }
        } else {
          setLoginMessage(
            <span className="text-danger">Unable to connect to server</span>
          );
        }
      } catch (error) {
        setLoginMessage(
          <span className="text-danger">An error occurred. Please try again.</span>
        );
      }
    }
  };
  
  
  let isValid = () => {
    let valid = true;

    //reading all controls from errors
    for (let control in errors) {
      if (errors[control].length > 0) valid = false;
    }

    return valid;
  };
  return (
    <form className="row">
      <div className="col-lg-5 col-md-7 mx-auto">
        <div className="card border-success shadow-lg my-2">
          <div className="card-header border-bottom border-success">
            <h4
              style={{ fontSize: "40px" }}
              className="text-success text-center"
            >
              Login
            </h4>
          </div>
          <div className="card-body border-bottom border-success">
              {/* Email starts */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  autoComplete="current-email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  onBlur={() => {
                    setDirty({ ...dirty, email: true });
                    validate();
                  }}
                  placeholder="Enter your email"
                  ref={myEmailRef}
                />
                <div className="text-danger">
                  {dirty["email"] && errors["email"][0] ? errors["email"] : ""}
                </div>
              </div>
              {/* Email ends */}

              {/* Password starts */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  onBlur={() => {
                    setDirty({ ...dirty, password: true });
                    validate();
                  }}
                />
                <div className="text-danger">
                  {dirty["password"] && errors["password"][0] ? errors["password"] : ""}
                </div>
              </div>
              {/* Password ends */}
            </div>


          <div className="card-footer text-center">
            <div className="m-1">{loginMessage}</div>
            <button className="btn btn-success m-2" onClick={onLoginClick}>
              Login
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
