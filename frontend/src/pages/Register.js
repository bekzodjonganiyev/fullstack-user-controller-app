import * as React from "react";
import Button from "../components/button/Button";
import InputField from "../components/inputField/InputField";

import { http } from "../components/utils/http";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = React.useState();
  const [email, setEmail] = React.useState();
  const [username, setUsername] = React.useState();
  const [pwd, setPwd] = React.useState();
  const [pwdPr, setPwdPr] = React.useState();

  const navigate = useNavigate();

  const signUp = () => {
    http
      .post("/sign-up", {
        name: fullName,
        email: email,
        username: username,
        password: pwd,
        password_repeat: pwdPr,
      })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <form>
      <h2 style={{ color: "black" }}>Create New Account</h2>
      <InputField
        required
        type="text"
        label="FullName*"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <InputField
        required
        type="text"
        label="Email*"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        required
        type="text"
        label="Username*"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <InputField
        required
        type="password"
        label="Password*"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <InputField
        required
        type="password"
        label="Confirm Password*"
        value={pwdPr}
        onChange={(e) => setPwdPr(e.target.value)}
      />
      <Button type="button" text={`Sign Up`} onClick={signUp} />
    </form>
  );
};

export default Register;
