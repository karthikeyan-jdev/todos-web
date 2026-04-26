import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../layouts/Layout";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import ProtectedRoute from "../routes/ProtectedRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element:(
         <ProtectedRoute>
          <Home />
         </ProtectedRoute>
         )
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "profile",
          element:( 
          <ProtectedRoute>
            <Profile />
         </ProtectedRoute>
          ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
