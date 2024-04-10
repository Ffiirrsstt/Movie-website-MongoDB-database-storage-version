import { useState, useEffect, useRef, useMemo, useContext } from "react";
import SearchMovies from "./SearchMovies";
import axios from "axios";
import Category from "./Category";
import Comment from "./Comment";
import AllComment from "./AllComment";
import MyContext from "../Context/MyContext";

import "../css/MoviesCategory.css";

const Movies = () => {
  const { readData, dataMoviesSearch, displayComment, setDataMoviesSearch } =
    useContext(MyContext);
  const numPromote = useRef(0); //useRef เก็บค่าไม่ให้หายหลังจากการ render

  const urlData = useMemo(
    () => [
      {
        index: 0,
        urlImg:
          "https://static0.srcdn.com/wordpress/wp-content/uploads/2019/04/Avengers-Endgame-Poster-Cropped.jpg",
        titleImg: "Avengers",
      },
      {
        index: 1,
        urlImg:
          "https://image.tmdb.org/t/p/w1280/wRbhBPT9uu8ZdXI6tRhc73Yq171.jpg",
        titleImg: "Harry Potter",
      },
      {
        index: 3,
        urlImg:
          "https://th.bing.com/th/id/R.863dba5ece0b25bbcef920493f9e402e?rik=1%2bRPZYTnRfVcpg&riu=http%3a%2f%2fyesofcorsa.com%2fwp-content%2fuploads%2f2018%2f05%2f4K-Avatar-Wallpaper-For-Desktop.jpg&ehk=DZgYan4YE9cKQORPjgezE%2fmuo%2b6TeO%2bVl6ifSVXqj60%3d&risl=&pid=ImgRaw&r=0",
        titleImg: "Avatar",
      },
      {
        index: 4,
        urlImg: "https://i.ytimg.com/vi/Cf7O68xQHlo/maxresdefault.jpg",
        titleImg: "Solo Leveling",
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
    runComment(numPage);
  }, [numPage]);

  useEffect(() => {
    runComment(1);
  }, [typeComment]);

  const runComment = async (page) => {
    const cm = await displayComment(typeComment, page);
    setComment(cm);
    generateNumBtn();
  };

  const readAllData = async () => {
    await readDataMovie();
    const cm = await displayComment(typeComment);
    setComment(cm);
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

  const stop = () => {
    setDataMoviesSearch([false, dataMoviesSearch[1]]);
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
          <SearchMovies
            dataMoives={Object.values(dataMoviesSearch[1])}
            stopSearching={stop}
          />
        )}
        <Comment
          typeComment={typeComment}
          sendAllComment={(data) => setComment(data)}
        />
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
