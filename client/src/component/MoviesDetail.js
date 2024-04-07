import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import axios from "axios";
import Nav from "./Nav";

const MoviesDetail = () => {
  const [dataDetail, setDataDetail] = useState();
  const { idMovies } = useParams();
  const navigate = useNavigate();

  const messageLogin = () => {
    swal({
      title: "The login session has expired.",
      text: "Do you want to log in again?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((result) => {
      result ? navigate("/login") : navigate("/");
    });
  };

  const fetchData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const tokenType = localStorage.getItem("tokenType");
    if (!accessToken) return messageLogin();
    if (!tokenType) return messageLogin();

    try {
      await axios.get(`${process.env.REACT_APP_API}users/data`, {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
        },
      });
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenType");
      }
      messageLogin();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}Movies/detail`, {
        params: {
          index: idMovies,
        },
      })
      .then((response) => {
        setDataDetail(JSON.parse(response.data));
        // console.log(JSON.parse(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [idMovies]);

  useEffect(() => {
    // console.log(dataDetail);
  }, [dataDetail]);

  return (
    <div>
      <Nav />
      Hello
    </div>
  );
};

export default MoviesDetail;
