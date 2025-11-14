import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import Error from "../Pages/Error";

import Home from "../Pages/Home";

import Login from "../Pages/Login";

import Signup from "../Pages/Signup";

import AvailableFoods from "../Pages/AvailableFoods";

import AddFood from "../Pages/AddFood";

import FoodDetails from "../Pages/FoodDetails";

import ManageFoods from "../Pages/ManageFoods";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    hydrateFallbackElement: <div>Loading...</div>,

    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "/available-foods",

        element: <AvailableFoods />,

        loader: () => fetch("http://localhost:3000/foods"),
      },
      {
        path: "/add-food",
        element: (
          <PrivateRoute>
            <AddFood />
          </PrivateRoute>
        ),
      },

      {
        path: "/foods/:id",
        element: (
          <PrivateRoute>
            <FoodDetails />
          </PrivateRoute>
        ),
      },

      {
        path: "/manage-foods",
        element: (
          <PrivateRoute>
            <ManageFoods />
          </PrivateRoute>
        ),
      },

      {
        path: "/update-food/:id",
        element: (
          <PrivateRoute>
            <ManageFoods />
          </PrivateRoute>
        ),
      },

      {
        path: "/login",

        element: <Login />,
      },

      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
