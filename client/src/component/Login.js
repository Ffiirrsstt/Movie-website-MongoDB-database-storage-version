import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import LoginRegister from "./LoginRegister";

const Login = () => {
  const [userData, sendUserData] = useState("");
  const [passwordData, setPasswordData] = useState("");

  const sendData = async () => {
    try {
      const formData = new FormData();
      formData.append("username", userData);
      formData.append("password", passwordData);

      await axios.post(`${process.env.REACT_APP_API}login`, formData);
      swal("Operation successful.", "", "success");
    } catch (error) {
      swal("Error Found", error, "error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendData();
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
