import { useState, useEffect, useRef, useMemo, useContext } from "react";
import SearchMovies from "./SearchMovies";
import axios from "axios";
import Category from "./Category";
import Comment from "./Comment";
import AllComment from "./AllComment";
import MyContext from "../Context/MyContext";

import "../css/MoviesCategory.css";

const Movies = () => {
  const { readData, readComment, dataMoviesSearch } = useContext(MyContext);
  const numPromote = useRef(0); //useRef เก็บค่าไม่ให้หายหลังจากการ render

  const urlData = useMemo(
    () => [
      {
        index: 0,
        urlImg:
          "https://th.bing.com/th/id/R.c17cd7651d43b1005384132c24cc1aa4?rik=n%2bOa1SmmXMtX0A&pid=ImgRaw&r=0",
        titleImg: "แมว",
      },
      {
        index: 1,
        urlImg:
          "https://th.bing.com/th/id/OIP.5FTenxt-3il9nwxzvDIYzgHaE7?rs=1&pid=ImgDetMain",
        titleImg: "หมา",
      },
      {
        index: 3,
        urlImg:
          "https://th.bing.com/th/id/R.c17cd7651d43b1005384132c24cc1aa4?rik=n%2bOa1SmmXMtX0A&pid=ImgRaw&r=0",
        titleImg: "แมว",
      },
      {
        index: 4,
        urlImg:
          "https://th.bing.com/th/id/OIP.5FTenxt-3il9nwxzvDIYzgHaE7?rs=1&pid=ImgDetMain",
        titleImg: "หมา",
      },
    ],
    []
  );

  const [imgPromote, setImgPromote] = useState(urlData[0]);
  const [selectImgPromote, setSelectImgPromote] = useState(0);
  const [dataMovies, setDataMovies] = useState();
  const [recommendations, setRecommendations] = useState();
  const [comment, setComment] = useState();
  const [numBtn, setNumBtn] = useState([]);
  const [typeComment, setTypeComment] = useState("All");
  const [numPage, setNumPage] = useState(1);
  const [test, setTest] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      numPromote.current = (numPromote.current + 1) % urlData.length;
      setImgPromote(urlData[numPromote.current]);
      setSelectImgPromote(numPromote.current);
    }, 3000);

    return () => clearInterval(interval);
  }, [urlData]);

  useEffect(() => {
    readAllData();
  }, []);

  useEffect(() => {
    generateNumBtn();
  }, [comment]);

  useEffect(() => {
    runComment();
  }, [numPage]);

  useEffect(() => {
    runComment(1);
  }, [typeComment]);

  useEffect(() => {
    setTest(dataMoviesSearch[1]);
  }, [dataMoviesSearch]);

  const runComment = async (page) => {
    await displayComment(page);
    generateNumBtn();
  };

  const displayComment = async (page = numPage) => {
    let data;
    if (typeComment === "All") data = "{}";
    else if (typeComment === "Positive") data = '{ "sentiment": "positive" }';
    else if (typeComment === "Negative") data = '{ "sentiment": "negative" }';
    const dataComment = await readComment(page, data);
    setComment(dataComment);
  };

  const readAllData = async () => {
    readDataMovie();
    displayComment();
  };

  const readDataSuggested = async () => {
    try {
      const resultData = await readData(false);
      if (!resultData[0]) return;

      const response = await axios.get(
        `${process.env.REACT_APP_API}suggested`,
        {
          params: {
            username: resultData[1].username,
          },
        }
      );
      setRecommendations(response.data.suggested);
      return resultData[1].username;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const readDataMovie = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}`);

      setDataMovies(JSON.parse(response.data));
      await readDataSuggested();
    } catch {}
  };

  const funImgPromote = (dataImg, index) => {
    setImgPromote(dataImg);
    setSelectImgPromote(index);
  };

  const generateNumBtn = () => {
    let result = [];
    if (comment) {
      const cmCount = JSON.parse(comment).count;
      for (let num = 1; num <= cmCount / 20 + 1; num++) result.push(num);
      setNumBtn(result);
    }
  };

  const receivedTypeComment = async (data) => setTypeComment(data);

  return (
    <div className="text-dark movies-main w-100 d-flex flex-column  align-items-center bg-dark">
      <div className="promote rounded border-0 relative">
        {imgPromote && (
          <img
            src={imgPromote.urlImg}
            className="img-fluid w-100 h-100 rounded"
            alt={imgPromote.titleImg}
          />
        )}
        <div className="promote-button d-flex align-items-center">
          {urlData.map((dataImg, index) => {
            return (
              <button
                key={index}
                className={
                  index === selectImgPromote
                    ? "btn btn-light border-0 mr-1 color-faded"
                    : "border-0 rounded-circle btn-promote mr-1 color-faded"
                }
                onClick={() => {
                  funImgPromote(dataImg, index);
                  numPromote.current = index;
                }}
              ></button>
            );
          })}
        </div>
      </div>
      <div className="d-flex flex-column align-items-center text-white vw-70">
        {!dataMoviesSearch[0] && (
          <>
            {dataMovies !== undefined && (
              <>
                {recommendations && (
                  <Category
                    text={"Recommendations for you"}
                    dataMovies={recommendations}
                    type={"Popular"}
                    classPB={""}
                  />
                )}
                {!recommendations && (
                  <Category
                    text={"Recommendations for you"}
                    dataMovies={dataMovies.Popular}
                    type={"Popular"}
                    classPB={""}
                  />
                )}
                <Category
                  text={"Movies"}
                  dataMovies={dataMovies.Movies}
                  typeData={"Movies"}
                  classPB={""}
                />
                <Category
                  text={"Animation"}
                  dataMovies={dataMovies.Anime}
                  typeData={"Animation"}
                  classPB={""}
                />
                <Category
                  text={"Live Action"}
                  dataMovies={dataMovies.liveAction}
                  typeData={"Live-Action"}
                  classPB={"pb-5"}
                />
              </>
            )}
          </>
        )}
        {dataMoviesSearch[0] && (
          <SearchMovies dataMoives={Object.values(dataMoviesSearch[1])} />
        )}
        <Comment sendAllComment={(data) => setComment(data)} />
        <AllComment comment={comment} sendTypeComment={receivedTypeComment} />
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

export default Movies;
