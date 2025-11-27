import './App.css';
import PublicPage from "./Components/Login_page/PublicPage";
import ProtectedPage from "./Components/Login_page/ProtectedPage";
import Login from "./Components/Login_page/Login";

import 'bootstrap/dist/css/bootstrap.min.css';


import HomePage from "./Components/Layout/Home_Page/HomePage"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgotPassword from './Components/Login_page/ForgotPassword/ForgotPassword';
import CreateUser from './Components/Login_page/CreateUser/CreateUser';

function App(){
  return (
    <BrowserRouter basename="/Org_Management_reactjs">
      <Routes>
        <Route path="/" element={<PublicPage><Login/></PublicPage>} />
        <Route path="/CreateUser" element={<CreateUser/>} />
        <Route path="/ForgotPassword" element={<ForgotPassword/>} />
        <Route path="/HomePage/*" element={<ProtectedPage><HomePage/></ProtectedPage>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
