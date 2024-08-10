// Tela com o layout da aplicação, tipo o Outlet.
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider, theme } from "antd";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { Home } from "./pages/Home/home";
import { Vehicles } from "./pages/Vehicles/vehicles";
import { Login } from "./pages/Login/login";
import { VehicleProvider } from "./contexts/vehicleContext";
import { Integration } from "./pages/Integration/integration";
import RegisterVehicles from "./pages/RegisterVehicles/registerVehicles";
import { AdminProvider } from "./contexts/adminContext";
import { AdminScreen } from "./pages/admins/admins";
import CheckLogin from "./util/Private";
import 'react-toastify/dist/ReactToastify.css'
import { Comments } from "./pages/Comments/comments";
import { NewPassword } from "./pages/NewPassword/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/new-password",
        element: <NewPassword />,
      },
      {
        path: "/home",
        element: <CheckLogin screen={<Home/>}/>,
      },
      {
        path: "/vehicles",
        element: <CheckLogin screen={<Vehicles/>}/>,
      },
      {
        path: "/vehicle-register",
        element: <CheckLogin screen={<RegisterVehicles edit={false}/>}/>,
      },
      {
        path: "/detailed-vehicle/:vehicleId",
        element: <CheckLogin screen={<RegisterVehicles edit={true}/>}/>,
      },
      {
        path: "/vehicles-comments/:vehicleId",
        element: <CheckLogin screen={<Comments/>}/>,
      },
      {
        path: "/mercado-livre-integration",
        element: <CheckLogin screen={<Integration/>}/>,
      },
      {
        path: "/admins",
        element: <CheckLogin screen={<AdminScreen/>}/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
    <AdminProvider>
      <VehicleProvider>
        <Suspense fallback={"Loading..."}>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
            <ToastContainer position="top-right" theme="colored" autoClose={3000} />
          </ThemeProvider>
        </Suspense>
      </VehicleProvider>
    </AdminProvider>
  </ConfigProvider>
);

reportWebVitals();
