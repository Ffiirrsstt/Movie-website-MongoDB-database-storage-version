import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Nav";

const MoviesDetail = () => {
  const [dataDetail, setDataDetail] = useState();
  const { idMovies } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}Movies/detail`, {
        params: {
          index: idMovies,
        },
      })
      .then((response) => {
        setDataDetail(JSON.parse(response.data));
        console.log(JSON.parse(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [idMovies]);

  useEffect(() => {
    console.log(dataDetail);
  }, [dataDetail]);

  return (
    <div>
      <Nav />
      Hello
    </div>
  );
};

export default MoviesDetail;
