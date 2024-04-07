import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import LoginRegister from "./LoginRegister";

const Login = () => {
  const [userData, sendUserData] = useState("");
  const [passwordData, setPasswordData] = useState("");
  const navigate = useNavigate();

  const sendData = async () => {
    try {
      const formData = new FormData();
      formData.append("username", userData);
      formData.append("password", passwordData);

      const response = await axios.post(
        `${process.env.REACT_APP_API}login`,
        formData
      );
      if (response.data.login) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("tokenType", response.data.tokenType);
        swal("Operation successful.", "Login successful.", "success");
        navigate("/");
      } else swal("Login failed.", "The password is incorrect.", "error");
    } catch (error) {
      swal("Error Found", error, "error");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendData();
  };

  const receiveUserData = (data) => sendUserData(data);
  const receivePasswordData = (data) => setPasswordData(data);
  return (
    <>
      <LoginRegister
        heading={"Sign In"}
        textBtn={"Login"}
        textLink={"Click to go to the registration page"}
        linkUrl={"/register"}
        sendUserData={receiveUserData}
        sendPassword={receivePasswordData}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Login;
