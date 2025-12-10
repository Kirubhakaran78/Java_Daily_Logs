import './App.css';
import { useEffect,useState } from "react"
import PublicPage from "./Components/Login_page/PublicPage";
import ProtectedPage from "./Components/Login_page/ProtectedPage";
import Login from "./Components/Login_page/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./Components/Layout/Home_Page/HomePage"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgotPassword from './Components/Login_page/ForgotPassword/ForgotPassword';
import CreateUser from './Components/Login_page/CreateUser/CreateUser';
import WebFont from "webfontloader";


function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          "Roboto",
          "Poppins",
          "Montserrat",
          "Inter",
          "Lato",
          "Nunito",
          "Raleway",
          "Ubuntu",
          "Work Sans",
          "Oswald",
          "Playfair Display",
          "Merriweather",
          "Lora"
        ],
      },
      active: () => {
        setFontsLoaded(true);
        console.log(" All fonts loaded");
      },
      inactive: () => {
        setFontsLoaded(true); // Still render even if fonts fail
        console.log(" Fonts failed to load");
      }
    });
  }, []);

  if (!fontsLoaded) {
    return <div>Loading fonts...</div>; // Or a loading spinner
  }
  return (
    <BrowserRouter basename="/Org_Management_reactjs">
      <Routes>
        <Route path="/" element={<PublicPage><Login /></PublicPage>} />
        <Route path="/CreateUser" element={<CreateUser />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/HomePage/*" element={<ProtectedPage><HomePage /></ProtectedPage>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
