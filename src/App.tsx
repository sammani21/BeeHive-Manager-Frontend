// App.tsx
import React, {useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signupf1 from "./pages/Signupf1";

import "./App.css";
//import BarNavigation from "./components/BarNavigation";
import NavigationBar from "./components/NavigationBar";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
//import SetServiceArea from "./components/SetServiceArea";
import DriverReport from "./pages/BeekeepersReportPage";
import IssuesReport from "./pages/IssuesReportPage";
import PassengersReport from "./pages/ProductReportPage";
import VehicleReport from "./pages/HiveReportPage";
import Passengers from "./pages/Products";
import Vehicles from "./pages/Hives";
//import Trips from "./pages/Trips";
import Drivers from "./pages/BeeKeepers";
import DashboardPage from "./pages/Dashboard";
import ManageProfile from "./pages/ManageProfile";
import ChatBox from "./pages/ChatBox";
import ChatRoomSelection from "./components/ChatRoomSelection"; // ✅ Import the new component



// Main App component
const App: React.FC = () => {

 
  const [isInChat, setIsInChat] = useState<boolean>(false);
  const [room, setRoom] = useState<string>("");



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
          <Route
            path="/myTestCompany"
            element={<NavigationBar />} //navbar+dashboardcomponent
          />

          <Route path="/reports/driver-details" element={<DriverReport />} />
          <Route path="/reports/issues-details" element={<IssuesReport />} />
          <Route
            path="/reports/passenger-details"
            element={<PassengersReport />}
          />

          <Route path="/reports/vehicle-details" element={<VehicleReport />} />

          <Route path="/passengers" element={<Passengers />} />
          <Route path="/vehicles" element={<Vehicles />} />

          <Route path="/drivers" element={<Drivers />} />
          <Route path="/manage-profile" element={<ManageProfile />} />
		 {/* Chatbox Route */}
     <Route
          path="/chatbox"
          element={isInChat ? <ChatBox room={room} /> : <ChatRoomSelection room={room} setRoom={setRoom} setIsInChat={setIsInChat} />}
        />
      </Routes>
        
      </BrowserRouter>
    </>
  );
};

export default App;
