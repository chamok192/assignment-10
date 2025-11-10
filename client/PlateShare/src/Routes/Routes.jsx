import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import Error from "../Pages/Error";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,

    children: [
      {
        index: true,

        element: <Home />,
      },

      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
