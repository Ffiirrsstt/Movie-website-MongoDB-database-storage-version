import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import MyContext from "../Context/MyContext";
import axios from "axios";
import Nav from "./Nav";
import "../css/MoviesDetail.css";

const MoviesDetail = () => {
  const [dataDetail, setDataDetail] = useState();
  const { readData } = useContext(MyContext);
  const { idMovies } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    readDataResult();
  }, []);

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
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  return (
    <div className="vw-100 vh-100 bg-dark d-flex justify-content-center">
      <Nav />
      {dataDetail && (
        <div className="box-movies-detail d-flex justify-content-center align-items-center">
          <div className="d-flex align-items-center h-80 w-100 text-white">
            <div className="d-flex h-100 ">
              <img
                src={dataDetail.image}
                alt={dataDetail.title}
                className="img-fluid rounded vw-40 h-100"
              />
            </div>
            <div className="h-100 w-100 d-flex justify-content-center">
              <div className="w-80 h-100 d-flex flex-column  pt-1vw pl-1 pr-1">
                <div className="w-100 d-flex justify-content-between align-items-center h-10 ">
                  <h1 className="fs-4 h-100 mb-0 d-flex align-items-center">
                    {dataDetail.title}
                  </h1>
                  <div className="btn btn-danger vh-5">
                    <h4 className="fs-6 d-flex text-center align-items-center">
                      The number of viewers is{" "}
                      {dataDetail.views.toLocaleString()}
                    </h4>
                  </div>
                </div>
                <div className="d-flex w-100">
                  {dataDetail.keywords.split(" ").map((data, index) => (
                    <button
                      key={index}
                      className={`fs-6 w-100 h-100 btn-info btn mb-1 vh-5
                       ${
                         index === dataDetail.keywords.split(" ").length - 1
                           ? ""
                           : "mr-1"
                       }`}
                    >
                      <h3 className="fs-6 ">{data}</h3>
                    </button>
                  ))}
                </div>
                <h3 className="fs-6 ">
                  Formats of shows: : {dataDetail.formats}
                </h3>
                <h3 className="fs-6 ">
                  Categories of shows. : {dataDetail.genres}
                </h3>
                <div>
                  <h4 className="fs-6 bg-briefly rounded mt-1 mb-1 p-3 vh-15">
                    Content summary : Updating information shortly.
                  </h4>
                </div>
                <div className="d-flex vh-12 mt-5 mb-5">
                  <button className="w-100 h-100 bg-red btn bg-wg mr-1 ">
                    <h4 className="fs-5 ">First episode : 0</h4>
                  </button>
                  <button className="w-100 h-100 bg-red btn bg-wg">
                    <h4 className="fs-5">Latest episode : 0</h4>
                  </button>
                </div>
                <div className="d-flex justify-centent-between w-100">
                  <h5 className="w-50">Total number of episodes</h5>
                  <h5 className="w-25 text-end bg-wg text-dark rounded pr-1">
                    0
                  </h5>
                  <h5 className="w-25 text-end">episodes</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesDetail;
