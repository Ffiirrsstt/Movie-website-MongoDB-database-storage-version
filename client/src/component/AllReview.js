import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ReviewAllReview.css";
import { PiUserMinusDuotone } from "react-icons/pi";
import { PiUserPlusDuotone } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import axios from "axios";
import moment from "moment";
import MyContext from "../Context/MyContext";

const AllReview = (props) => {
  const { Review, sendTypeReview } = props;
  const { readData, fillData } = useContext(MyContext);

  const [allReview, setAllReview] = useState();
  const [readMore, setReadMore] = useState();
  const [openEditReview, setOpenEditReview] = useState();
  const [textReviewEdit, setTextReviewEdit] = useState("");
  const [typeReview, setTypeReview] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    if (Review) {
      setAllReview(Object.values(JSON.parse(Review))[0]);
    }
  }, [Review]);

  useEffect(() => {
    if (allReview) {
      setReadMore(fillData(allReview, false));
      setOpenEditReview(fillData(allReview, false));
    }
  }, [allReview]);

  useEffect(() => {
    sendTypeReview(typeReview);
  }, [typeReview]);

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
        }
      );
      setAllReview(JSON.parse(response.data));

      data[indexReviewShow] = false;
      setOpenEditReview(data);
    } catch {}
  };

  const deleteReview = async (idReview, indexReviewShow, createData) => {
    try {
      const login = await readData(true);
      if (!login[0]) return navigate(login[1]);

      let data = [...openEditReview];

      const username = login[1].username;

      const response = await axios.delete(
        `${process.env.REACT_APP_API}Review/delete`,
        {
          data: {
            username,
            idReview,
            createData,
          },
        }
      );
      setAllReview(JSON.parse(response.data));

      data.splice(indexReviewShow, 1);
      setOpenEditReview(data);
    } catch {}
  };

  return (
    <div className="d-flex w-100 flex-column mt-5 rounded position-relative">
      <select
        className="form-select mb-3 text-center fs-5"
        onChange={(event) => setTypeReview(event.target.value)}
      >
        <option value="All">All</option>
        <option value="Positive">Positive</option>
        <option value="Negative">Negative</option>
      </select>
      {allReview &&
        allReview.map((dataReview, indexReview) => (
          <div
            key={indexReview}
            className={`w-100 Review-box 
            ${indexReview === allReview.length - 1 ? "mb-5" : ""}
            `}
          >
            <div className="h-20 w-100 d-flex justify-content-between bg-red-Review rounded">
              <div className="h-100 d-flex">
                <h3 className="fs-4 mr-1 ml-1 ">{dataReview.username}</h3>
                <h4 className="d-flex align-items-center h-100">
                  {dataReview.sentiment === "positive" ? (
                    <PiUserPlusDuotone className="fs-3 cursor-pointer bg-red rounded-circle " />
                  ) : (
                    <PiUserMinusDuotone className="fs-3 cursor-pointer bg-success rounded-circle" />
                  )}
                </h4>
              </div>
              <div className="h-100 mr-1 d-flex">
                {
                  <h4 className="d-flex align-items-center fs-6 mr-1">
                    {dataReview.edited && "previously edited"}
                  </h4>
                }
                <h4 className="d-flex align-items-center fs-6 mr-1">
                  {moment(dataReview.created.$date).format("YYYY-MM-DD")}
                </h4>
                {openEditReview &&
                  dataReview.edit &&
                  !openEditReview[indexReview] && (
                    <div className="h-100">
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

                {openEditReview && openEditReview[indexReview] && (
                  <div className="d-flex align-items-center ">
                    <IoArrowBackOutline
                      className="fs-4 cursor-pointer"
                      onClick={() => {
                        let data = [...openEditReview];
                        data[indexReview] = false;
                        setOpenEditReview(data);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div
              className={`h-80 w-100 
              ${
                openEditReview && !openEditReview[indexReview]
                  ? "d-flex align-items-center pl-1 overflow-auto justify-content-between"
                  : "bg-light rounded"
              }`}
            >
              {openEditReview && !openEditReview[indexReview] ? (
                <>
                  {readMore && !readMore[indexReview] ? (
                    dataReview.Review.length < 40 ? (
                      <h4 className="fs-5">{dataReview.Review}</h4>
                    ) : (
                      <div className="d-flex align-items-center  ">
                        <h4 className="fs-5 mr-1">
                          {dataReview.Review.substring(0, 40)}...
                        </h4>
                        <h4
                          onClick={() => {
                            let data = [...readMore];
                            data[indexReview] = true;
                            setReadMore(data);
                          }}
                          className="fs-5 text-muted filter-brightness cursor-pointer"
                        >
                          Read more
                        </h4>
                      </div>
                    )
                  ) : (
                    <div className="d-flex align-items-center">
                      <h4 className="fs-5">{dataReview.Review}</h4>
                    </div>
                  )}

                  <h3 className="fs-6 mr-1 ml-1 d-flex align-items-center">
                    {new Date(dataReview.created.$date).toLocaleTimeString()}
                  </h3>
                </>
              ) : (
                <div className="w-100 h-100 mb-3 d-flex justify-content-between align-items-center">
                  <input
                    type="text"
                    className="form-control h-80 w-100 fs-5 border-0 focus-outline-none ml-1"
                    id="editData"
                    placeholder="You can express your thoughts here"
                    maxLength={60}
                    onChange={(event) => setTextReviewEdit(event.target.value)}
                  />
                  <button
                    className="ml-1 mr-1 btn btn-warning"
                    onClick={() =>
                      editReview(
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
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AllReview;
