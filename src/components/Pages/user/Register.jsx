import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import successHandle from "../../../utils/successHandle";
import errorHandle from "../../../utils/errorHandle";

document.querySelector("html body").style.background = "#f6f9fa";

const apiEndPoint = process.env.REACT_APP_BASE_URL + "/register";
const EMAIL_REGEX_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!^%*?&]{8,15}$/;
const PASSWORD_STRENGTH = {
  1: "Very weak",
  2: "Weak",
  3: "Meduim",
  4: "Strong",
};

const Register = () => {
  const intialState = {
    loading: false,
    name: "",
    email: "",
    answer: "",
    answerError: "",
    password: "",
    passwordError: "",
    passwordStatus: "",
    confirmPassword: "",
    confirmPasswordError: "",
    registerError: "",
    isAdmin: false,
  };
  const navigate = useNavigate();
  const [state, setCompleteState] = useState(intialState);
  const setState = (newState) =>
    setCompleteState((prevState) => ({ ...prevState, ...newState }));

  const onFocusName = () => setState({ registerError: "" });

  const onFocusEmail = () => setState({ emailError: "", registerError: "" });

  const validateEmail = () => {
    const isValidEmail = EMAIL_REGEX_PATTERN.test(state.email);
    if (!isValidEmail) {
      setState({ emailError: "*Please enter a valid email!" });
    }
  };

  const onFocusAnswer = () =>
    setState({ answerError: "", ForgotPasswordError: "" });

  const validateAnswer = () => {
    if (!state.answer) {
      setState({ answerError: "*Enter your answer!" });
    }
  };

  const checkStrength = (pass) => {
    if (pass.length > 15) {
      setState({ passwordError: "*Password is too lengthy" });
      return;
    } else if (pass.length < 8) {
      setState({ passwordError: "*Password is too short" });
      return;
    }

    if (STRONG_PASSWORD_REGEX.test(pass)) {
      setState({ passwordStatus: "Password is strong" });
    }

    let count = 0;
    let regex1 = /[a-z]/;
    if (regex1.test(pass)) count++;
    let regex2 = /[A-Z]/;
    if (regex2.test(pass)) count++;
    let regex3 = /[\d]/;
    if (regex3.test(pass)) count++;
    let regex4 = /[!@#$%^&*.?]/;
    if (regex4.test(pass)) count++;
    setState({ passwordError: "", passwordStatus: PASSWORD_STRENGTH[count] });
  };

  useEffect(() => {
    if (!state.password) {
      return;
    }
    checkStrength(state.password);
  }, [state.password]);

  const onFocusPassword = () =>
    setState({ passwordError: "", passwordStatus: "", registerError: "" });

  const validatePassword = () => {
    if (!state.password) {
      setState({ passwordError: "*Please Enter a valid password!" });
    }
  };

  const onFocusConfirmPassoword = () =>
    setState({ confirmPasswordError: "", registerError: "" });

  const validateConfirmPassword = () => {
    const { password, confirmPassword } = state || {};
    if (!confirmPassword) {
      setState({ confirmPasswordError: "*Please enter a valid password!" });
    }
    if (password !== confirmPassword) {
      setState({ confirmPasswordError: "*Password are not matched!" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };

  const register = async () => {
    setState({ loading: true });
    const {
      name,
      email,
      answer,
      emailError,
      password,
      passwordError,
      confirmPassword,
      confirmPasswordError,
      answerError,
      isAdmin,
    } = state || {};
    const isValid =
      name &&
      email &&
      password &&
      confirmPassword &&
      answer &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      !answerError;
    if (!isValid) {
      setState({
        registerError: "*Plese fill the correct details",
        loading: false,
      });
      return;
    }

    const data = { name, email, answer, password, isAdmin };
    await axios
      .post(apiEndPoint, data)
      .then((res) => {
        setState({ loading: false });
        successHandle(res.data.message);
        navigate("/login");
      })
      .catch((error) => {
        setState({ loading: false });
        errorHandle(error);
      });
  };

  return (
    <div className="mt-5">
      <div class="container d-flex justify-content-center align-items-center">
        <div class="page-register mt-5">
          <div class="card mb-0">
            <div class="card-body">
              <form onSubmit={handleSubmit}>
                <div class="form-group mb-3">
                  <label for="exampleDropdownFormName" class="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your name"
                    value={state.name}
                    onFocus={onFocusName}
                    onChange={(e) => setState({ name: e.target.value })}
                    disabled={state.loading}
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="exampleDropdownFormEmail1" class="form-label">
                    Email address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="exampleDropdownFormEmail1"
                    placeholder="email@example.com"
                    value={state.email}
                    onChange={(e) => setState({ email: e.target.value })}
                    onFocus={onFocusEmail}
                    onBlur={validateEmail}
                    disabled={state.loading}
                  />
                  {state.emailError ? (
                    <small className="text-danger ml-2">
                      {state.emailError}
                    </small>
                  ) : null}
                </div>
                <div class="form-group mb-3">
                  <label for="exampleDropdownFormEmail1" class="form-label">
                    What is your first nickname?{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="exampleDropdownFormtext1"
                    placeholder="example"
                    value={state.answer}
                    onChange={(e) => setState({ answer: e.target.value })}
                    onFocus={onFocusAnswer}
                    onBlur={validateAnswer}
                    disabled={state.loading}
                  />
                  {state.answerError ? (
                    <small className="text-danger ml-2">
                      {state.answerError}
                    </small>
                  ) : null}
                </div>
                <div class="form-group mb-3">
                  <label for="exampleDropdownFormPassword1" class="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="exampleDropdownFormPassword1"
                    placeholder="Password"
                    value={state.password}
                    onChange={(e) => setState({ password: e.target.value })}
                    onFocus={onFocusPassword}
                    onBlur={validatePassword}
                    disabled={state.loading}
                  />
                  {state.passwordError ? (
                    <small className="text-danger ml-2">
                      {state.passwordError}
                    </small>
                  ) : null}
                  {state.passwordStatus ? (
                    <small className="text-info ml-2">
                      {state.passwordStatus}
                    </small>
                  ) : null}
                </div>
                <div class="form-group mb-3">
                  <label for="exampleDropdownFormPassword1" class="form-label">
                    Confirm password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="exampleDropdownFormPassword1"
                    placeholder="Confim password"
                    value={state.confirmPassword}
                    onChange={(e) =>
                      setState({ confirmPassword: e.target.value })
                    }
                    onFocus={onFocusConfirmPassoword}
                    onBlur={validateConfirmPassword}
                    disabled={state.loading}
                  />
                  {state.confirmPasswordError ? (
                    <small className="text-danger ml-2">
                      {state.confirmPasswordError}
                    </small>
                  ) : null}
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="registerAsAdmin"
                    checked={state.isAdmin}
                    onChange={(e) => setState({ isAdmin: e.target.checked })}
                    disabled={state.loading}
                  />
                  <label className="form-check-label" htmlFor="registerAsAdmin">
                    Register as Admin
                  </label>
                </div>
                {state.loading ? (
                  <div className="pb-3 text-center">
                    <div class="spinner-border text-secondary" role="status" />
                  </div>
                ) : null}
                <button
                  type="submit"
                  class="btn btn-sm btn-block btn-primary w-100"
                  onClick={handleSubmit}
                  disabled={state.loading}
                >
                  Register
                </button>
                {state.registerError ? (
                  <div className="text-center fw-500 mt-2">
                    <small className="text-danger">{state.registerError}</small>
                  </div>
                ) : null}

                <div className="mt-3 text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
