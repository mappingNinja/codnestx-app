import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authContext from "../../../context/authContext/authContext";
import { toast } from "react-toastify";
import successHandle from "../../../utils/successHandle";
import errorHandle from "../../../utils/errorHandle";

document.querySelector("html body").style.background = "#f6f9fa";

const EMAIL_REGEX_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const apiEndPoint = process.env.REACT_APP_BASE_URL + "/login";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(authContext);

  const intialState = {
    loading: false,
    email: "",
    password: "",
    emailError: "",
  };
  const [state, setCompleteState] = useState(intialState);
  const setState = (newState) =>
    setCompleteState((prevState) => ({ ...prevState, ...newState }));

  const validateEmail = () => {
    const isValidEmail = EMAIL_REGEX_PATTERN.test(state.email);
    if (!isValidEmail) {
      setState({ emailError: "*Please enter a valid email!" });
    }
  };

  const onFocusEmail = () => {
    setState({ emailError: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  const login = async () => {
    setState({ loading: true });
    const { email, password, emailError } = state || {};
    const isValid = emailError === intialState?.emailError && email && password;
    if (!isValid) {
      setState({ loading: false });
      return;
    }

    const data = { email, password };
    await axios
      .post(apiEndPoint, data)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        successHandle(res.data.message);
        setState({ loading: false });
        navigate("/");
        return;
      })
      .catch((error) => {
        setState({ loading: false });
        errorHandle(error);
        return;
      });
  };

  return (
    <div className="mt-5 pt-5">
      <div className="d-flex justify-content-center align-items-center">
        <div className="page-login pt-5">
          <div className="card mb-0">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label for="exampleDropdownFormEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleDropdownFormEmail1"
                    placeholder="email@example.com"
                    value={state.email}
                    onFocus={onFocusEmail}
                    onChange={(e) => setState({ email: e.target.value })}
                    onBlur={validateEmail}
                    disabled={state.loading}
                  />
                  {state.emailError ? (
                    <small className="text-danger ml-2">
                      {state.emailError}
                    </small>
                  ) : null}
                </div>
                <div className="form-group mb-3">
                  <label
                    for="exampleDropdownFormPassword"
                    className="form-label"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleDropdownFormPassword1"
                    placeholder="Password"
                    value={state.password}
                    onChange={(e) => setState({ password: e.target.value })}
                    disabled={state.loading}
                  />
                </div>

                {state.loading ? (
                  <div className="py-2 text-center">
                    <div class="spinner-border text-secondary" role="status" />
                  </div>
                ) : null}
                <button
                  type="submit"
                  className="btn btn-sm btn-block btn-primary w-100"
                  onClick={handleSubmit}
                  disabled={state.loading}
                >
                  Login
                </button>
                <div className="mt-3 text-center">
                  Don't have an account?{" "}
                  <Link to="/register" className="#">
                    Register
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
