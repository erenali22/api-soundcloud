// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { mapErrors } from "../../util";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const demoUser = (e) => {
    e.preventDefault();
    setErrors([]);
    const credential = "demo0@user.io";
    const password = "password";
    dispatch(
      sessionActions.login({
        credential,
        password,
      }),
    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
      // else if (data.message) setErrors([data.message])
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(mapErrors(data.errors));
        else if (data.message) setErrors([data.message]);
      });
  };

  return (
    <div className="Form">
      <div className="title">Sign in</div>
      {!errors.length ? (
        <div></div>
      ) : (
        <ul className="form-error">
          {errors.map((error, idx) => (
            <li key={idx} className="warning">
              {error}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="submit" type="submit">
          OK
        </button>
        <button className="submit" onClick={closeModal}>
          Cancel
        </button>
      </form>
      <button className="submit" onClick={demoUser}>
        Demo User Login
      </button>
    </div>
  );
}

export default LoginFormModal;
