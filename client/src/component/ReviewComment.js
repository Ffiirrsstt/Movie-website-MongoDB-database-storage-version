import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import MyContext from "../Context/MyContext";
import "../css/ReviewAllReview.css";

const Review = ({ type, typeAPN, sendAllReviewComment, idMV }) => {
  const { readData, displayReviewComment } = useContext(MyContext);
  const navigator = useNavigate();
  const [dataReviewComment, setdataReviewComment] = useState("");

  const writeReview = async () => {
    await addReview();
    const rv = await displayReviewComment("RV", typeAPN, 1);
    sendAllReviewComment(rv);
  };

  const writeComment = async () => {
    await addComment();
    const cm = await displayReviewComment("CM", typeAPN, 1, idMV);
    sendAllReviewComment(cm);
  };

  const addComment = async () => {
    try {
      const resultSentiment = await checkSentiment();
      if (!resultSentiment) return;

      const sentiment = resultSentiment.sentiment;
      const username = resultSentiment.username;

      const response = await axios.post(
        `${process.env.REACT_APP_API}add/Comment`,
        {
          dataReviewComment,
          sentiment,
          username,
          idMV,
        }
      );
      setdataReviewComment("");
      return response.data.message;
    } catch (error) {
      ReviewError();
    }
  };

  const addReview = async () => {
    try {
      const resultSentiment = await checkSentiment();
      if (!resultSentiment) return;

      const sentiment = resultSentiment.sentiment;
      const username = resultSentiment.username;

      const response = await axios.post(
        `${process.env.REACT_APP_API}add/Review`,
        {
          dataReviewComment,
          sentiment,
          username,
        }
      );
      setdataReviewComment("");
      return response.data.message;
    } catch (error) {
      CommentError();
    }
  };

  const checkSentiment = async () => {
    const resultData = await readData(true);
    if (!resultData[0]) return navigator(resultData[1]);

    const response = await axios.get(`${process.env.REACT_APP_API}sentiment`, {
      params: {
        text: dataReviewComment,
      },
    });
    return {
      sentiment: response.data.sentiment,
      username: resultData[1].username,
    };
  };

  const ReviewError = () =>
    swal(
      "Encountered an error",
      "The Reviewing system encountered an error",
      "error"
    );

  const CommentError = () =>
    swal(
      "Encountered an error",
      "The commenting system encountered an error",
      "error"
    );

  return (
    <div className="Review-main w-100 d-flex flex-column align-items-center rounded mt-5">
      <div className="h-20 d-flex align-items-center w-100">
        <h3 className="fs-3 text-center text-shadow text-white">
          {type === "Review" ? "Write a review" : "Write a comment"}
        </h3>
      </div>
      <div className="d-flex h-60 w-100 bg-success">
        <textarea
          className="form-control w-100 h-100 p-2 fs-5 "
          id="writeReview"
          value={dataReviewComment}
          onChange={(event) => setdataReviewComment(event.target.value)}
          placeholder="You can express your thoughts here"
          maxLength={60}
        ></textarea>
      </div>
      <div className="h-20 d-flex align-items-center justify-content-end w-100">
        <div className="d-flex align-items-center justify-content-end w-20 h-50">
          <h6 className="d-flex align-items-end fs-5 h-100 pr-05">
            {dataReviewComment.length} / 60
          </h6>
        </div>
        <button
          onClick={() => (type === "RV" ? writeReview() : writeComment())}
          className="btn btn-warning w-20 h-50"
        >
          <h5 className="fs-5 m-0 text-center text-shadow text-white">post</h5>
        </button>
      </div>
    </div>
  );
};

export default Review;
