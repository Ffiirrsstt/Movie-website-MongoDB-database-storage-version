import React, { useState } from "react";
import MyContext from "./MyContext";
import axios from "axios";
import swal from "sweetalert";

const MyProvider = ({ children }) => {
  const [dataMoviesSearch, setDataMoviesSearch] = useState([false, ""]);

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

  const searchData = async (dataSearch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}movies/search`,
        {
          params: { dataSearch: dataSearch },
        }
      );
      // console.log(JSON.parse(response.data));
      setDataMoviesSearch([true, JSON.parse(response.data)]);
    } catch {}
  };

  const readComment = async (page, search) => {
    try {
      let username = await readData(false);
      username = !username[0] ? "" : username[1].username;

      const response = await axios.get(
        `${process.env.REACT_APP_API}show/Comment`,
        {
          params: {
            username: username,
            pageComment: page,
            findData: search,
          },
        }
      );
      return response.data;
    } catch {
      console.log("Error");
    }
  };

  const fillData = (datalength, data) => Array(datalength.length).fill(data);

  return (
    <MyContext.Provider
      value={{
        readData,
        clearToken,
        readComment,
        fillData,
        searchData,
        dataMoviesSearch,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
