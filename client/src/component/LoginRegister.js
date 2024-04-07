import { Link } from "react-router-dom";
import "../css/LoginRegister.css";

const LoginRegister = (props) => {
  const {
    heading,
    textBtn,
    textLink,
    linkUrl,
    sendUserData,
    sendPassword,
    handleSubmit,
  } = props;

  return (
    <div className="vw-100 vh-100 bg-dark d-flex justify-content-center align-items-center text-white">
      <img
        src="https://movieindex.tk/netflix.webp"
        className="img-fluid w-100 h-100 fade-login relative"
        alt=""
      />
      <div className="login-box rounded">
        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
          <div className="w-80">
            <h2>{heading}</h2>
            <div className="">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="form-control mb-5p "
                  id="inputUsername"
                  placeholder="Username"
                  onChange={(event) => sendUserData(event.target.value)}
                />
                <input
                  type="text"
                  className="form-control mb-15p "
                  id="inputPassword"
                  placeholder="Password"
                  onChange={(event) => sendPassword(event.target.value)}
                />
                <button type="submit" className="btn btn-danger w-100 mb-5p ">
                  <h3 className="fs-6">{textBtn}</h3>
                </button>
              </form>
              <button className="btn btn-pale  w-100 ">
                <Link to={linkUrl} className="text-decoration-none">
                  <h3 className="fs-6 text-white">{textLink}</h3>
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
