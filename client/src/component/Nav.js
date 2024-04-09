import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import MyContext from "../Context/MyContext";

const Nav = () => {
  const { readData, clearToken, searchData } = useContext(MyContext);
  const [uiLogin, setUiLogin] = useState();
  const [user, setUser] = useState();
  const [dataSearch, setDataSearch] = useState("");

  useEffect(() => {
    readLogin();
  }, []);

  const readLogin = async () => {
    const resultLogin = await readData(false);
    setUiLogin(resultLogin[0]);
    setUser(resultLogin[1]);
  };

  const logout = () => {
    const currentUrl = window.location.pathname;

    clearToken();
    if (currentUrl === `/`) window.location.reload();
  };

  return (
    <nav className="nav bg-dark justify-content-center fixed-top">
      <ul className="nav nav-tabs row w-100 border-bottom-1">
        <li className="nav-item d-flex col-2">
          <Link to="/" className="nav-link">
            <h1 className="text-red text-center">Movie</h1>
          </Link>
        </li>
        <li className="nav-item d-flex justify-content-end align-items-center col-9">
          <input
            className="nav-item input h-50 border-0 rounded focus-outline-none w-50 mr-2 p-3 text-end"
            onChange={(event) => setDataSearch(event.target.value)}
            value={dataSearch}
            placeholder="ค้นหาหนังที่ต้องการได้ที่นี่"
          />
          <button
            type="button"
            name=""
            id=""
            className="btn btn-secondary rounded-circle "
            onClick={() => {
              searchData(dataSearch);
              setDataSearch("");
            }}
          >
            <IoSearchOutline />
          </button>
        </li>
        {uiLogin ? (
          <li className="nav-item dropdown d-flex justify-content-end col-1">
            <Link
              to="/Love"
              className="nav-link dropdown-toggle d-flex flex-column text-center text-white 
          align-items-center justify-content-center vw-10"
              data-bs-toggle="dropdown"
              role="button"
            >
              <h4 className="text-center">
                <FaUserCircle />
              </h4>
            </Link>
            <div className="dropdown-menu">
              {user !== "" && (
                <div to="#" className="dropdown-item d-flex">
                  <h3 className="fs-6 font-weight-normal">
                    username : {user.username}
                  </h3>
                </div>
              )}
              <div className="dropdown-divider"></div>
              <Link to="/" onClick={logout} className="dropdown-item">
                Logout
              </Link>
            </div>
          </li>
        ) : (
          <li className="nav-item d-flex justify-content-center align-items-center col-1">
            <Link
              to="/login"
              className="w-100 d-flex justify-content-center align-items-center text-decoration-none"
            >
              <button className="btn btn-warning w-95">
                <h4 className="fs-6 m-0 text-center text-shadow text-white">
                  login
                </h4>
              </button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
