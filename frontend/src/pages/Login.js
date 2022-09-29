import React from "react";
import Button from "../components/button/Button";
import useToken from "../components/hook/useToken";
import InputField from "../components/inputField/InputField";

// import { useNavigate } from "react-router-dom"
import { http } from "../components/utils/http";

const Login = () => {
  const [username, setUsername] = React.useState();
  const [pwd, setPwd] = React.useState();

  const [setToken] = useToken(true);

  const signIn = () => {
    http
      .post("/login", {
        username: username,
        password: pwd,
      })
      .then((res) => {
        if (res.data) {
          setToken(res.data.token);
          console.log(res.data.token);
        } else {
          console.log(res);
          alert(res.msg);
        }
      })
      .catch((err) => {
        console.log(err.response.data.msg);
        alert(err.response.data.msg);
      });
  };

  return (
    <form>
      <h2 style={{ color: "black" }}>Login</h2>
      <InputField
        type="text"
        label="Username*"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <InputField
        type="password"
        label="Password*"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <Button type="button" text="Sign In" onClick={() => signIn()} />
    </form>
  );
};

export default Login;
