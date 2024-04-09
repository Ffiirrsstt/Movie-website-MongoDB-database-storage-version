import { Link } from "react-router-dom";
import "../css/SearchMovies.css";

const SearchMovies = ({ dataMoives }) => {
  return (
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
  );
};

export default SearchMovies;
