import './App.css';
import PublicPage from "../src/Components/Login_page/PublicPage"
import ProtectedPage from "../src/Components/Login_page/ProtectedPage"
import Login from "../src/Components/Login_page/Login"
import HomePage from "../src/Components/Login_page/HomePage"
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import HomeMain from "../src/Components/Home_page/HomeMain"
import CreateUser from "../src/Components/Login_page/CreateUser/CreateUser"
import ForgotPassword from "./Components/Login_page/ForgotPassword/ForgotPassword"



import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<PublicPage><Login /></PublicPage>} />
        <Route path='/CreateUser' element={<CreateUser />} />
        <Route path='/ForgotPassword' element={<ForgotPassword />} />

        {/* Nested Routes */}
        <Route
          path='/HomePage/*'
          element={<ProtectedPage><HomePage /></ProtectedPage>}
        />

      </Routes>
    </BrowserRouter>

      {/* <HomeMain /> */}
    </>
  );
}

export default App;
