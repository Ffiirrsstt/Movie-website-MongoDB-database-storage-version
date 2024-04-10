import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import MyContext from "../Context/MyContext";
import "../css/CommentAllComment.css";

const Comment = ({ sendAllComment, typeComment }) => {
  const { readData, displayComment } = useContext(MyContext);
  const navigator = useNavigate();
  const [dataComment, setDataComment] = useState("");

  const writeComment = async () => {
    await addComment();
    const cm = await displayComment(typeComment, 1);
    sendAllComment(cm);
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
          dataComment,
          sentiment,
          username,
        }
      );
      setDataComment("");
      return response.data.message;
    } catch (error) {
      commentError();
    }
  };

  const checkSentiment = async () => {
    const resultData = await readData(true);
    if (!resultData[0]) return navigator(resultData[1]);

    const response = await axios.get(`${process.env.REACT_APP_API}sentiment`, {
      params: {
        text: dataComment,
      },
    });
    return {
      sentiment: response.data.sentiment,
      username: resultData[1].username,
    };
  };

  const commentError = () =>
    swal(
      "Encountered an error",
      "The commenting system encountered an error",
      "error"
    );

  return (
    <div className="comment-main w-100 d-flex flex-column align-items-center rounded mt-5">
      <div className="h-20 d-flex align-items-center w-100">
        <h3 className="fs-3 text-center text-shadow text-white">
          expressing opinions
        </h3>
      </div>
      <div className="d-flex h-60 w-100 bg-success">
        <textarea
          className="form-control w-100 h-100 p-2 fs-5 "
          id="writeComment"
          value={dataComment}
          onChange={(event) => setDataComment(event.target.value)}
          placeholder="You can express your thoughts here"
          maxLength={60}
        ></textarea>
      </div>
      <div className="h-20 d-flex align-items-center justify-content-end w-100">
        <div className="d-flex align-items-center justify-content-end w-20 h-50">
          <h6 className="d-flex align-items-end fs-5 h-100 pr-05">
            {dataComment.length} / 60
          </h6>
        </div>
        <button onClick={writeComment} className="btn btn-warning w-20 h-50">
          <h5 className="fs-5 m-0 text-center text-shadow text-white">post</h5>
        </button>
      </div>
    </div>
  );
};

export default Comment;
