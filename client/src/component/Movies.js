import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Category from "./Category";
import axios from "axios";

import "../css/MoviesCategory.css";
import MyContext from "../Context/MyContext";

const Movies = () => {
  const { readData } = useContext(MyContext);
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

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      numPromote.current = (numPromote.current + 1) % urlData.length;
      setImgPromote(urlData[numPromote.current]);
      setSelectImgPromote(numPromote.current);
    }, 3000);

    return () => clearInterval(interval);
  }, [urlData]);

  useEffect(() => {
    readDataMovie();
  }, []);

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
      // setRecommendations(JSON.parse(response.data));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const readDataMovie = () => {
    readDataSuggested();
    axios
      .get(`${process.env.REACT_APP_API}`)
      .then((response) => {
        if (response.data) {
          setDataMovies(JSON.parse(response.data));
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const funImgPromote = (dataImg, index) => {
    setImgPromote(dataImg);
    setSelectImgPromote(index);
  };

  return (
    <div className="text-dark movies-main w-100 d-flex flex-column  align-items-center bg-dark">
      <div className="promote rounded border-0 relative">
        {imgPromote && (
          <img
            src={imgPromote.urlImg}
            className="img-fluid w-100 h-100 rounded"
            // className="img-fluid w-100 h-100 rounded fade-promote"
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
      <div className="text-white w-70">
        {dataMovies !== undefined && (
          <>
            <Category
              text={"Recommendations for you"}
              dataMovies={
                recommendations ? recommendations : dataMovies.Popular
              }
              type={"Popular"}
              classPB={""}
            />
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
      </div>
    </div>
  );
};

export default Movies;
