import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";
import Defaultlayout from "./components/Layout/Defaultlayout";
import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authorization, noUser, selectData } from "./redux/reducer";
import { useSelector } from "react-redux";
import PlayAudio from "./components/PlayAudio";
import ListAudio from "./components/PlayAudio/ListAudio";


function App() {
  const tokenString = sessionStorage.getItem('token');
  const token = JSON.parse(tokenString);
  const dispatch = useDispatch();
  const data = useSelector(selectData);

  useEffect(() => {
    if (token)
      dispatch(authorization(token))
    else
      dispatch(noUser())
  }, [token, dispatch])

  return (
    <>
      <Router>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = Defaultlayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                    {
                      data.data.currentSong.isShowRound ? <> <PlayAudio /> <ListAudio /></> : Fragment
                    }
                  </Layout>
                }
              />
            );
          })}
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = Defaultlayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={data.data.currentUser.name ?
                  <Layout>
                    <Page />
                  </Layout> : <Navigate to="/login" replace />
                }
              />
            );
          })}
        </Routes>
      </Router>
    </>
  );
}

export default App;
