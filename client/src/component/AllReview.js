import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiUserMinusDuotone } from "react-icons/pi";
import { PiUserPlusDuotone } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import axios from "axios";
import moment from "moment";
import MyContext from "../Context/MyContext";
import swal from "sweetalert";
import "../css/ReviewAllReview.css";
import "../css/MoviesCategory.css";

const AllReview = (props) => {
  const { Review, pageReset, sendTypeReview, sendPageNum, sendPageReset } =
    props;
  const { readData, fillData } = useContext(MyContext);

  const [allReview, setAllReview] = useState();
  const [allReviewCount, setAllReviewCount] = useState();
  const [readMore, setReadMore] = useState();
  const [openEditReview, setOpenEditReview] = useState();
  const [textReviewEdit, setTextReviewEdit] = useState("");
  const [typeReview, setTypeReview] = useState("All");

  const [pageNum, setPageNum] = useState(1);
  const [pageData, setPageData] = useState([
    [0, false],
    [3, true],
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    if (Review) {
      setAllReviewCount(JSON.parse(Review).count);
      setAllReview(Object.values(JSON.parse(Review))[0]);
    }
  }, [Review]);

  useEffect(() => {
    resetPage();
  }, [pageReset]);

  useEffect(() => {
    if (allReview) {
      setReadMore(fillData(allReview, false));
      setOpenEditReview(fillData(allReview, false));
    }
  }, [allReview]);

  useEffect(() => {
    sendTypeReview(typeReview);
  }, [typeReview]);

  useEffect(() => {
    sendPageNum(pageNum);
  }, [pageNum]);

  const resetPage = () => {
    setPageData([
      [0, false],
      [3, true],
    ]);
    setPageNum(1);
    sendPageReset(false);
  };

  const editReview = async (idReview, indexReviewShow, createData) => {
    try {
      const login = await readData(true);
      if (!login[0]) return navigate(login[1]);

      let data = [...openEditReview];

      const username = login[1].username;

      const response = await axios.put(
        `${process.env.REACT_APP_API}Review/edit`,
        {
          username,
          textReviewEdit,
          idReview,
          createData,
          typeReview: typeReturn(typeReview),
        }
      );
      setAllReview(JSON.parse(response.data));

      data[indexReviewShow] = false;
      setOpenEditReview(data);
      resetPage();
      setTextReviewEdit("");
    } catch {}
  };

  const deleteReview = async (idReview, indexReviewShow, createData) => {
    try {
      const login = await readData(true);
      if (!login[0]) return navigate(login[1]);

      let data = [...openEditReview];

      const username = login[1].username;
      const typeSend =
        typeReview === "All"
          ? "{}"
          : `{ "sentiment": "${typeReview.toLowerCase()}" }`;

      const response = await axios.delete(
        `${process.env.REACT_APP_API}Review/delete`,
        {
          data: {
            username,
            idReview,
            createData,
            typeReview: typeReturn(typeReview),
          },
        }
      );
      setAllReview(JSON.parse(response.data));

      data.splice(indexReviewShow, 1);
      setOpenEditReview(data);
      resetPage();
    } catch {}
  };

  const modify = (textReview) => {
    let numModify = 0;
    textReview = textReview.split("");
    textReview.forEach((char, index, array) => {
      if (/\d/.test(char)) numModify++;
      if (numModify === 6) {
        array[index] += "\n";
        numModify = 0;
      }
    });
    return textReview;
  };

  const typeReturn = (typeReview) =>
    typeReview === "All"
      ? "{}"
      : `{ "sentiment": "${typeReview.toLowerCase()}" }`;

  return (
    <div className="d-flex w-100 flex-column mt-5 rounded position-relative">
      <select
        className="form-select mb-3 text-center fs-5"
        onChange={(event) => {
          setTypeReview(event.target.value);
          resetPage();
        }}
      >
        <option value="All">All</option>
        <option value="Positive">Positive</option>
        <option value="Negative">Negative</option>
      </select>
      {allReview && (
        <div
          className={`d-flex w-100 ${
            allReview.length < 3 ? "" : "justify-content-between"
          }`}
        >
          {allReview.map((dataReview, indexReview) => (
            <div
              key={indexReview}
              className={`vh-35-55 w-100 fs-5 border-pp rounded p-2 mb-5
              position-relative ${
                indexReview === allReview.length - 1 ? "" : "mr-2"
              }`}
            >
              {openEditReview && !openEditReview[indexReview] ? (
                <>
                  {dataReview.Review.match(/\d/g) > 6
                    ? dataReview.Review
                    : modify(dataReview.Review)}
                </>
              ) : (
                <textarea
                  type="text"
                  className="form-control h-70 w-100 fs-5 mb-1"
                  id="editData"
                  placeholder="You can express your thoughts here"
                  maxLength={60}
                  onChange={(event) => setTextReviewEdit(event.target.value)}
                />
              )}

              <div
                className="position-absolute-review d-flex justify-content-end 
              align-items-center vh-5 w-100 pr-1 pl-1"
              >
                <div className="d-flex flex-column h-100 w-100">
                  <div className="h-100 d-flex justify-content-end">
                    <h4 className="h-100 d-flex align-items-center fs-6 mr-1">
                      {dataReview.edited && "previously edited"}
                    </h4>
                    <h4 className={`h-100 d-flex align-items-center fs-6`}>
                      {moment(dataReview.created.$date).format("YYYY-MM-DD")}
                    </h4>
                  </div>
                  <div
                    className={`d-flex h-100 w-100
                    ${
                      openEditReview && !openEditReview[indexReview]
                        ? "justify-content-end"
                        : "justify-content-between"
                    }
                    `}
                  >
                    {openEditReview && openEditReview[indexReview] && (
                      <button
                        className="btn btn-warning pb-0 p-1 pl-1-5 pr-1-5"
                        onClick={() =>
                          textReviewEdit === ""
                            ? swal(
                                "Failed to edit review",
                                "Please enter the review text to proceed with editing the review.",
                                "error"
                              )
                            : editReview(
                                dataReview.idReview,
                                indexReview,
                                dataReview.created.$date
                              )
                        }
                      >
                        <h5 className="fs-6 text-white text-center text-shadow text-white">
                          edit
                        </h5>
                      </button>
                    )}
                    <div
                      className={` h-100 d-flex flex-warp justify-content-between
                      ${
                        openEditReview &&
                        dataReview.edit &&
                        !openEditReview[indexReview] &&
                        "w-100"
                      }
                      `}
                    >
                      {openEditReview &&
                        dataReview.edit &&
                        !openEditReview[indexReview] && (
                          <div className="d-flex h-100 align-items-center">
                            <CiEdit
                              className="fs-4 mr-1 cursor-pointer"
                              onClick={() => {
                                let data = [...openEditReview];
                                data[indexReview] = true;
                                setOpenEditReview(data);
                              }}
                            />
                            <MdDelete
                              className="fs-4 cursor-pointer"
                              onClick={() =>
                                deleteReview(
                                  dataReview.idReview,
                                  indexReview,
                                  dataReview.created.$date
                                )
                              }
                            />
                          </div>
                        )}
                      <div className="d-flex h-100 align-items-center">
                        <h3 className="d-flex h-100 justify-centent-end text-end align-items-center fs-6 mr-1 mb-0">
                          {dataReview.username}
                        </h3>
                        <h4 className="d-flex h-100 align-items-center mb-0">
                          {dataReview.sentiment === "positive" ? (
                            <PiUserPlusDuotone className="fs-3 cursor-pointer bg-red rounded-circle" />
                          ) : (
                            <PiUserMinusDuotone className="fs-3 cursor-pointer bg-success rounded-circle" />
                          )}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {pageData[0][1] && indexReview === 0 && (
                <GrPrevious
                  className="fs-1 prev-data icon-faded cursor-pointer"
                  onClick={() => {
                    setPageData([
                      [
                        pageData[0][0] - 3,
                        pageData[0][0] - 3 >= 3 ? true : false,
                      ],
                      [pageData[1][0] - 3, true],
                    ]);
                    setPageNum(pageNum - 1);
                  }}
                />
              )}
              {pageData[1][1] &&
                indexReview === 2 &&
                dataReview.length !== 0 &&
                allReviewCount > 3 && (
                  <GrNext
                    className="fs-1 next-data icon-faded cursor-pointer"
                    onClick={() => {
                      setPageData([
                        [pageData[0][0] + 3, true],
                        [
                          pageData[1][0] + 3,
                          pageData[1][0] + 3 < allReviewCount ? true : false,
                        ],
                      ]);
                      setPageNum(pageNum + 1);
                    }}
                  />
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllReview;
