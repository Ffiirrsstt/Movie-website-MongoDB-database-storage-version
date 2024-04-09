import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import MyContext from "../Context/MyContext";
import axios from "axios";
import Nav from "./Nav";

const MoviesDetail = () => {
  const [dataDetail, setDataDetail] = useState();
  const { readData } = useContext(MyContext);
  const { idMovies } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    readDataResult();
  }, []);

  useEffect(() => {
    // console.log(dataDetail);
  }, [dataDetail]);

  const readDataResult = async () => {
    const resultData = await readData(true);
    if (!resultData[0]) return navigate(resultData[1]);

    axios
      .get(`${process.env.REACT_APP_API}movies/detail`, {
        params: {
          index: idMovies,
          username: resultData[1].username,
        },
      })
      .then((response) => {
        setDataDetail(JSON.parse(response.data));
        // console.log(JSON.parse(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  return (
    <div>
      <Nav />
      Hello
    </div>
  );
};

export default MoviesDetail;
