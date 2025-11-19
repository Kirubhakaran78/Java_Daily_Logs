import './App.css';
import { BrowserRouter } from "react-router-dom";
import UserForm from './Components/UserForm';
import UserTable from './Components/UserTable';
import { useState } from 'react';

function App() {
const[reload,setReload]=useState(false);

  return (
    <>
    <BrowserRouter basename="/react-User">
     <UserForm onUserReload={()=> setReload(!reload)}/>
   <UserTable reload={reload}/>
   </BrowserRouter>
   </>
  
  );
}

export default App;

