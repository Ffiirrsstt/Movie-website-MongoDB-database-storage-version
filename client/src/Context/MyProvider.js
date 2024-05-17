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
      clearToken();
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
      setDataMoviesSearch([true, JSON.parse(response.data)]);
    } catch {}
  };

  const readReview = async (page, search) => {
    try {
      let username = await readData(false);
      username = !username[0] ? "" : username[1].username;

      const response = await axios.get(
        `${process.env.REACT_APP_API}show/Review`,
        {
          params: {
            username: username,
            pageReview: page,
            findData: search,
          },
        }
      );
      return response.data;
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
    } catch {}
  };

  const displayReviewComment = async (
    CMorRV,
    typeReviewComment,
    page = 1,
    idMV = undefined
  ) => {
    let data;
    if (page === 0) page = 1;
    if (CMorRV === "CM") {
      if (typeReviewComment === "All") data = `{"idMV":${idMV}}`;
      else if (typeReviewComment === "Positive")
        data = `{ "sentiment": "positive" ,"idMV":${idMV}}`;
      else if (typeReviewComment === "Negative")
        data = `{ "sentiment": "negative" ,"idMV":${idMV}}`;
      const dataComment = await readComment(page, data);
      return dataComment;
    } else {
      if (typeReviewComment === "All") data = "{}";
      else if (typeReviewComment === "Positive")
        data = '{ "sentiment": "positive" }';
      else if (typeReviewComment === "Negative")
        data = '{ "sentiment": "negative" }';
      const dataReview = await readReview(page, data);
      return dataReview;
    }
  };

  const fillData = (datalength, data) => Array(datalength.length).fill(data);

  return (
    <MyContext.Provider
      value={{
        readData,
        clearToken,
        readReview,
        fillData,
        searchData,
        dataMoviesSearch,
        setDataMoviesSearch,
        displayReviewComment,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
