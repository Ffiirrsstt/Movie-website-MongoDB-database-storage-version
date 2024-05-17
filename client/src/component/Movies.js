import { useState, useEffect, useRef, useMemo, useContext } from "react";
import SearchMovies from "./SearchMovies";
import axios from "axios";
import Category from "./Category";
import ReviewComment from "./ReviewComment";
import AllReview from "./AllReview";
import MyContext from "../Context/MyContext";

import "../css/MoviesCategory.css";

const Movies = () => {
  const {
    readData,
    dataMoviesSearch,
    displayReviewComment,
    setDataMoviesSearch,
  } = useContext(MyContext);
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
  const [typeReview, setTypeReview] = useState("All");
  const [Review, setReview] = useState();
  const [pageNum, setPageNum] = useState(1);
  const [pageReview, setPageReview] = useState(1);

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
    runReview(1);
  }, [typeReview]);

  useEffect(() => {
    runReview(pageNum);
  }, [pageNum]);

  const runReview = async (page) => {
    const rv = await displayReviewComment("RV", typeReview, page);
    setReview(rv);
  };

  const readAllData = async () => {
    await readDataMovie();
    const rv = await displayReviewComment("RV", typeReview);
    setReview(rv);
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
    } catch (error) {}
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

  const stop = () => {
    setDataMoviesSearch([false, dataMoviesSearch[1]]);
  };

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
                  classPB={""}
                />
                <Category
                  text={"Drama"}
                  dataMovies={dataMovies.Drama}
                  typeData={"Drama"}
                  classPB={""}
                />
                <Category
                  text={"Fantasy"}
                  dataMovies={dataMovies.Fantasy}
                  typeData={"Fantasy"}
                  classPB={""}
                />
                <Category
                  text={"Science Fiction"}
                  dataMovies={dataMovies.ScienceFiction}
                  typeData={"Science-Fiction"}
                  classPB={""}
                />
                <Category
                  text={"Comedy"}
                  dataMovies={dataMovies.Comedy}
                  typeData={"Comedy"}
                  classPB={""}
                />
                <Category
                  text={"Musical"}
                  dataMovies={dataMovies.Musical}
                  typeData={"Musical"}
                  classPB={""}
                />
                <Category
                  text={"Romance"}
                  dataMovies={dataMovies.Romance}
                  typeData={"Romance"}
                  classPB={""}
                />
                <Category
                  text={"Documentary"}
                  dataMovies={dataMovies.Documentary}
                  typeData={"Documentary"}
                  classPB={""}
                />
                <Category
                  text={"Thriller"}
                  dataMovies={dataMovies.Thriller}
                  typeData={"Thriller"}
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

        <AllReview
          Review={Review}
          pageReset={pageReview}
          sendTypeReview={(data) => setTypeReview(data)}
          sendPageNum={(data) => setPageNum(data)}
          sendPageReset={(data) => setPageReview(false)}
        />
        <div className="w-100 text-end"></div>
        <div className="mb-10 w-100">
          <ReviewComment
            type={"RV"}
            typeAPN={typeReview}
            sendAllReviewComment={(data) => {
              setReview(data);
              setPageReview(true);
              setPageNum(1);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Movies;
