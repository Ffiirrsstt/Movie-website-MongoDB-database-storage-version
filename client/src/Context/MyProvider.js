import React, { useState } from "react";
import MyContext from "./MyContext";
import axios from "axios";
import swal from "sweetalert";

const MyProvider = ({ children }) => {
  const messageLogin = () => {
    return new Promise((resolve, reject) => {
      swal({
        title: "The login session has expired.",
        text: "Do you want to log in again?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((result) => {
        result ? resolve([false, "/login"]) : resolve([false, "/"]);
      });
    });
  };

  const checkToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    const tokenType = localStorage.getItem("tokenType");
    if (!accessToken) return false;
    if (!tokenType) return false;
    return { accessToken, tokenType };
  };

  const clearToken = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
  };

  const readData = async (useMessage) => {
    try {
      const { accessToken, tokenType } = checkToken();
      if (!accessToken && !tokenType) {
        clearToken();
        return useMessage ? await messageLogin() : [false, ""];
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API}users/data`,
        {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        }
      );
      return [true, response.data];
    } catch (error) {
      if (error.response.status === 401) {
        clearToken();
      }
      return useMessage ? await messageLogin() : [false, ""];
    }
  };

  return (
    <MyContext.Provider value={{ readData }}>{children}</MyContext.Provider>
  );
};

export default MyProvider;
