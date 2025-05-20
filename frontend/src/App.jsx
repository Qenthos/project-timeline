import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          {/* <Route path="/prepare-expo" element={<ExpoComposer />}></Route>
          <Route path="/my-expo" element={<MyExpo />}></Route> */}
          <Route path="*" element={<Page404 />}></Route>
        </Routes>
      </BrowserRouter>
  );  
}

export default App;
