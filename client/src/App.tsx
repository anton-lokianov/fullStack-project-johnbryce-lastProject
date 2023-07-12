import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import { VacationForm } from "./components/VacationForm";
import { Home } from "./pages/Home";
import FollowersGraph from "./components/FollowersChart";
import Page404 from "./pages/Page404";
import { useSelector } from "react-redux";
import { RootState } from "./redux/Store";

const Layout = () => {
  const location = useLocation();
  const hideNavBar = ["/", "/register"].includes(location.pathname);
  const token = useSelector((state: RootState) => state.users.token);
  const isAdmin = useSelector((state: RootState) => state.users.user?.level);

  return (
    <div className="app">
      <div className="navbar">
        <header>{!hideNavBar && <NavBar />}</header>
      </div>
      <div className="main">
        <main>
          <Routes>
            <Route
              path="/"
              element={token ? <Navigate to="/home" /> : <Login />}
            />
            <Route
              path="/register"
              element={token ? <Navigate to="/home" /> : <Register />}
            />
            <Route
              path="/home"
              element={token ? <Home /> : <Navigate to="/" />}
            />
            <Route
              path="/addVacation"
              element={
                isAdmin === 1 ? <VacationForm /> : <Navigate to="/home" />
              }
            />
            <Route
              path="/editVacation/:id"
              element={
                isAdmin === 1 ? <VacationForm /> : <Navigate to="/home" />
              }
            />
            <Route
              path="/followersChart"
              element={
                isAdmin === 1 ? <FollowersGraph /> : <Navigate to="/home" />
              }
            />
            <Route
              path="*"
              element={token ? <Page404 /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </div>
  );
}

export default App;
