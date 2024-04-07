import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import LoginRegister from "./LoginRegister";

const Register = () => {
  const [userData, setUserData] = useState("");
  const [passwordData, setPasswordData] = useState("");

  const sendData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}register`,
        { userData, passwordData }
      );
      swal("Operation successful.", response.data.message, "success");
    } catch (error) {
      swal("Error Found", error, "error");
    }
  };

  const checkUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}register/User`,
        { params: { userData } }
      );
      return response.data.resultCheck;
    } catch (error) {
      swal("Error Found", error, "error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resultCheck = await checkUser();
    if (userData.replace(/ /g, "") !== "") {
      if (resultCheck) {
        await sendData();
      } else {
        swal(
          "The username is already in use.",
          "Please edit the username and proceed with registration again.",
          "error"
        );
      }
    } else {
      swal(
        "The username has an error.",
        "Edit the username without using special characters and without leaving any spaces.",
        "error"
      );
    }
  };

  const receiveUserData = (data) => setUserData(data);
  const receivePassword = (data) => setPasswordData(data);

  return (
    <>
      <LoginRegister
        heading={"Sign Up"}
        textBtn={"Register"}
        textLink={"Click to go to the login page."}
        linkUrl={"/login"}
        sendUserData={receiveUserData}
        sendPassword={receivePassword}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Register;
