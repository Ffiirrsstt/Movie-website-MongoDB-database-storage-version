import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

import axios from "axios";
import "../css/MoviesCategory.css";

const Category = (props) => {
  const { text, dataMovies, typeData, classPB } = props;

  const [pageData, setPageData] = useState([
    [0, false],
    [6, true],
  ]);
  const [dataShow, setDataShow] = useState(dataMovies);

  let dataLen;

  switch (typeData) {
    case "Movies":
      dataLen = 61;
      break;
    case "Animation":
      dataLen = 24;
      break;
    // case "Live-Action":
    //   dataLen = 4;
    //   break;

    // ต้องการให้แสดงรายการที่ยอดนิยม 6 อันดับแรก หรือ แสดงรายการแนะนำ
    // case "Popular":
    //   dataLen = 6;
    //   break;

    case "Action":
      dataLen = 24;
      break;
    // case "Drama":
    //   dataLen = 6;
    //   break;
    case "Fantasy":
      dataLen = 14;
      break;
    /*case "Science-Fiction ":
          dataLen = 3;
          break;
    case "Comedy":
            dataLen = 4;
            break;
    case "Musical":
      dataLen = 5;
      break;
    case "Romance":
        dataLen = 1;
        break;
    case "Documentary":
      dataLen = 1;
      break;
    */
    case "Thriller":
      dataLen = 7;
      break;
    default:
      dataLen = 6;
  }

  useEffect(() => {
    if (typeData !== undefined) {
      axios
        .get(`${process.env.REACT_APP_API}show/${typeData}`, {
          params: {
            dataSkip: pageData[0][0],
          },
        })
        .then((response) => {
          setDataShow(JSON.parse(response.data));
        });
      // .catch((error) => {});
    }
  }, [pageData, typeData]);

  useEffect(() => {
    if (dataShow.length < 6) {
      const add = Array.from({ length: 6 - dataShow.length }, () => []);
      setDataShow(() => dataShow.concat(add));
    }
  }, [dataShow]);

  return (
    <div className={`pt-5 test ${classPB} w-100`}>
      <h1 className="fs-2 category">{text}</h1>
      <div className="d-flex justify-content-between">
        {dataShow !== undefined &&
          dataShow.map((detailMovie, indexMovie) => (
            <div
              key={indexMovie}
              className={`cover-channel relative ${
                indexMovie === 5 ? "" : "mr-1"
              }`}
            >
              <Link to={`/Movies/${detailMovie.index}`}>
                <img
                  src={detailMovie.image}
                  className={`img-fluid rounded h-100 w-100 cover ${
                    detailMovie.length === 0 ? "d-none" : ""
                  }`}
                  alt={detailMovie.title}
                />
              </Link>
              {pageData[0][1] && indexMovie === 0 && (
                <GrPrevious
                  className="fs-1 prev-data icon-faded cursor-pointer"
                  onClick={() => {
                    setPageData([
                      [
                        pageData[0][0] - 6,
                        pageData[0][0] - 6 >= 6 ? true : false,
                      ],
                      [pageData[1][0] - 6, true],
                    ]);
                  }}
                />
              )}
              {pageData[1][1] &&
                indexMovie === 5 &&
                detailMovie.length !== 0 &&
                dataLen > 6 && (
                  <GrNext
                    className="fs-1 next-data icon-faded cursor-pointer"
                    onClick={() =>
                      setPageData([
                        [pageData[0][0] + 6, true],
                        [
                          pageData[1][0] + 6,
                          pageData[1][0] + 6 < dataLen ? true : false,
                        ],
                      ])
                    }
                  />
                )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Category;
