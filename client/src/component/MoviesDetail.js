import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import MyContext from "../Context/MyContext";
import axios from "axios";
import Nav from "./Nav";
import ReviewComment from "./ReviewComment";
import AllComment from "./AllComment";
import "../css/MoviesDetail.css";

const MoviesDetail = () => {
  const { readData, displayReviewComment } = useContext(MyContext);
  const { idMovies } = useParams();

  const [dataDetail, setDataDetail] = useState();
  const [Comment, setComment] = useState();
  const [typeComment, setTypeComment] = useState("All");
  const [numBtn, setNumBtn] = useState([]);
  const [numPage, setNumPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    readDataResult();
    readCM();
  }, []);

  useEffect(() => {
    generateNumBtn();
    if (Comment) {
      const cmCount = JSON.parse(Comment).count;
      const totalPage = Math.ceil(cmCount / 20);
      if (numPage <= totalPage) runComment(numPage);
      else {
        runComment(totalPage);
        setNumPage(totalPage);
      }
    }
  }, [Comment]);

  useEffect(() => {
    runComment(numPage);
  }, [dataDetail, numPage]);

  useEffect(() => {
    runComment(1);
  }, [typeComment]);

  const readCM = async () => {
    if (dataDetail) {
      const cm = await displayReviewComment(
        "CM",
        typeComment,
        1,
        dataDetail.index
      );
      setComment(cm);
    }
  };

  const runComment = async (page) => {
    if (dataDetail) {
      const cm = await displayReviewComment(
        "CM",
        typeComment,
        page,
        dataDetail.index
      );
      setComment(cm);
      generateNumBtn();
    }
  };

  const generateNumBtn = () => {
    let result = [];
    if (Comment) {
      const cmCount = JSON.parse(Comment).count;
      if (cmCount % 20 === 0)
        for (let num = 1; num <= cmCount / 20; num++) result.push(num);
      else for (let num = 1; num <= cmCount / 20 + 1; num++) result.push(num);
      setNumBtn(result);
    }
  };

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
    <div className="w-100 bg-dark d-flex justify-content-center">
      <Nav />
      <div className="vw-80 h-100">
        {dataDetail && (
          <div className="d-flex flex-column">
            <div
              className="box-movies-detail w-100 d-flex justify-content-center 
            align-items-center pt-5 pb-5"
            >
              <div className="d-flex h-100 w-100 text-white">
                <div className="d-flex h-100 bg-white">
                  <img
                    src={dataDetail.image}
                    alt={dataDetail.title}
                    className="img-fluid rounded h-100"
                  />
                </div>
                <div className="h-100 w-100 d-flex justify-content-end">
                  <div className="w-95 h-100 d-flex flex-column">
                    <div className="d-flex flex-column h-100">
                      <div className="w-100 d-flex for-title-s justify-content-between align-items-center h-20">
                        <h1 className="fs-4 h-100 mb-0 d-flex align-items-center pb-1">
                          {dataDetail.title}
                        </h1>
                        <div className=" p-2 pb-0  btn btn-danger">
                          <h4 className="fs-6 text-center">
                            The number of viewers is{" "}
                            {dataDetail.views.toLocaleString()}
                          </h4>
                        </div>
                      </div>
                      <div className="d-flex flex-warp w-100">
                        {dataDetail.keywords.split(" ").map((data, index) => (
                          <button
                            key={index}
                            className={`fs-6 flex-fill h-100 btn-info btn mb-1 vh-5
                             ${
                               index ===
                               dataDetail.keywords.split(" ").length - 1
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
                      <h3 className="fs-6 pb-3">
                        Categories of shows. : {dataDetail.genres}
                      </h3>
                    </div>
                    <div className="d-flex h-100 w-100 justify-content-center align-items-center">
                      <h4 className="fs-6 bg-briefly rounded p-3 w-100 vh-25">
                        Content summary : Updating information shortly.
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box-episode d-flex flex-column mt-6">
              <div className="d-flex h-80 mb-5">
                <button className="w-100 h-100 bg-red btn bg-wg mr-1 ">
                  <h4 className="fs-5">First episode : 0</h4>
                </button>
                <button className="w-100 h-100 bg-red btn bg-wg">
                  <h4 className="fs-5">Latest episode : 0</h4>
                </button>
              </div>
              <div className="d-flex h-20 justify-centent-between w-100 text-white">
                <h5 className="w-50">Total number of episodes</h5>
                <h5 className="w-25 text-end bg-wg text-dark rounded pr-1">
                  0
                </h5>
                <h5 className="w-25 text-end">episodes</h5>
              </div>
            </div>
          </div>
        )}
        {dataDetail && (
          <>
            <ReviewComment
              type={"CM"}
              typeAPN={typeComment}
              sendAllReviewComment={(data) => setComment(data)}
              idMV={dataDetail.index}
            />
            <AllComment
              Comment={Comment}
              sendTypeComment={(data) => setTypeComment(data)}
              idMV={dataDetail.index}
              changeComment={readCM}
              CommentEdit={() => setNumPage(1)}
            />
          </>
        )}
        <div className="w-100 text-end">
          {!(numBtn.length === 1) &&
            numBtn.map((data, index) => (
              <button
                key={index}
                className={`rounded text-end mb-5 ${
                  index === numBtn.length - 1 ? "" : "mr-1"
                }  `}
                onClick={() => setNumPage(data)}
              >
                {data}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MoviesDetail;
