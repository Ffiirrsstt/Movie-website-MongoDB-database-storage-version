import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";

const TestLogin = false;

const Nav = () => {
  return (
    <nav className="nav bg-dark justify-content-center fixed-top">
      <ul className="nav nav-tabs row w-100 border-bottom-1">
        <li className="nav-item d-flex col-2">
          <Link to="/" className="nav-link">
            <h2 className="text-red text-center">Movie</h2>
          </Link>
        </li>
        <li className="nav-item d-flex justify-content-end align-items-center col-9">
          <input
            className="nav-item input h-50 border-0 rounded focus-outline-none w-50 mr-2 p-3 text-end"
            placeholder="ค้นหาหนังที่ต้องการได้ที่นี่"
          />
          <button
            type="button"
            name=""
            id=""
            className="btn btn-secondary rounded-circle "
          >
            <IoSearchOutline />
          </button>
        </li>
        {TestLogin ? (
          <li className="nav-item dropdown d-flex justify-content-end col-1">
            <Link
              to="/Love"
              className="nav-link dropdown-toggle d-flex flex-column text-center text-white 
          align-items-center justify-content-center vw-10"
              data-bs-toggle="dropdown"
              role="button"
            >
              <h6 className="text-center">
                <FaUserCircle />
              </h6>
            </Link>
            <div className="dropdown-menu">
              <Link to="#" className="dropdown-item">
                Action
              </Link>
              <Link to="#" className="dropdown-item">
                Another action
              </Link>
              <div className="dropdown-divider"></div>
              <Link to="#" className="dropdown-item">
                Action
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
                <h6 className="m-0 text-center text-shadow text-white">
                  เข้าสู่ระบบ
                </h6>
              </button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
