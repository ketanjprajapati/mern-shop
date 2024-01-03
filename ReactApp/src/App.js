import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ShopList from "./shop/ShopList";
import ViewShop from "./shop/ViewShop";
import ProtectedRoute from "./auth/ProtectedRoute";
import Auth from "./auth/Auth";

export default function App() {
  return (
    <Router>
      <div className=" ">
        <Routes>

          <Route path="/shops" element={
            <ProtectedRoute>
              <ShopList />
            </ProtectedRoute>
          } />
          <Route path="/shops/:shopId" element={
            <ProtectedRoute>
              <ViewShop />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <Auth />
          } />
        </Routes>


      </div>
    </Router>
  );
}
