// App.tsx
import * as React from "react";
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
import DriverReport from "./pages/DriversReportPage";
import IssuesReport from "./pages/IssuesReportPage";
import PassengersReport from "./pages/PassengerReportPage";
import VehicleReport from "./pages/VehicleReportPage";
import Passengers from "./pages/Passengers";
import Vehicles from "./pages/Vehicles";
//import Trips from "./pages/Trips";
import Drivers from "./pages/Drivers";
import DashboardPage from "./pages/Dashboard";


// Main App component
const App: React.FC = () => {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path="*"
						element={<h1>404 Not Found</h1>}
					></Route>
					<Route
						path="/"
						element={<LandingPage />}
					/>
					<Route
						path="/dashboard"
						element={<DashboardPage />}
					/>
					<Route
						path="/signup"
						element={<Signupf1 />}
					/>
					<Route
						path="/login"
						element={<LoginPage />}
					/>
					<Route
						path="/forgotPassword"
						element={<ForgotPassword />}
					/>
					<Route
						path="/resetPassword/:token"
						element={<ResetPassword />}
					/>
					<Route
						path="/myTestCompany"
						element={<NavigationBar />} //navbar+dashboardcomponent
					/>
					
					<Route
						path="/reports/driver-details"
						element={<DriverReport />}
					/>
					<Route
						path="/reports/issues-details"
						element={<IssuesReport />}
					/>
					<Route
						path="/reports/passenger-details"
						element={<PassengersReport />}
					/>

					<Route
						path="/reports/vehicle-details"
						element={<VehicleReport />}
					/>

					<Route
						path="/passengers"
						element={<Passengers />}
					/>
					<Route
						path="/vehicles"
						element={<Vehicles />}
					/>
					
					<Route
						path="/drivers"
						element={<Drivers />}
					/>
					


				</Routes>


			</BrowserRouter>
		</>
	);
};

export default App;
