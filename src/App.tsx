// App.tsx
// Main entry point of the React application. 
// This file handles all the routing between different pages of the app.

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Importing all the pages
import LandingPage from "./pages/LandingPage";
import Signupf1 from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Products from "./pages/Products";
import Hives from "./pages/Hives";
import Beekeepers from "./pages/BeeKeepers";
import DashboardPage from "./pages/Dashboard";
import ManageProfile from "./pages/ManageProfile"
import Recommendation from "./pages/Recommendation";


// Importing reusable components
import NavigationBar from "./components/NavigationBar";

// Main App component
const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<h1>404 Not Found</h1>}></Route>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/signup" element={<Signupf1 />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route path="/myTestCompany" element={<NavigationBar />} />
          <Route path="/products" element={<Products />} />
          <Route path="/hives" element={<Hives />} />
          <Route path="/beekeepers" element={<Beekeepers />} />
          <Route path="/manage-profile" element={<ManageProfile />} />
          <Route path="/recommendation" element={<Recommendation />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
