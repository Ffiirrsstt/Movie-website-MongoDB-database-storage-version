import { Link } from "react-router-dom";
import "../css/SearchMovies.css";

const SearchMovies = ({ dataMoives, stopSearching }) => {
  return (
    <>
      <div
        className="w-100 vh-15 mt-5 d-flex pl-1 pr-1 align-items-center
       justify-content-between result-search"
      >
        <h2 className="fs-4">Search results : {dataMoives.length}</h2>
        <button className="btn btn-warning" onClick={stopSearching}>
          <h2 className="fs-5 text-white text-center text-shadow">
            Stop searching
          </h2>
        </button>
      </div>
      <div className="w-100 d-flex flex-wrap  justify-content-start mt-5">
        {dataMoives.map((data, index) => (
          <Link
            key={index}
            to={`/Movies/${data.index}`}
            className="movies-search mr-1 mb-2"
          >
            <img
              src={data.image}
              className={`img-fluid rounded cover w-100 h-100 bg-danger}`}
              alt={data.title}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default SearchMovies;
