import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import MoviesDetail from "./component/MoviesDetail";
import Login from "./component/Login";
import Register from "./component/Register";
import MyProvider from "./Context/MyProvider";

const MyRoute = () => {
  return (
    <MyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/Movies/:idMovies" element={<MoviesDetail />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    </MyProvider>
  );
};

export default MyRoute;
