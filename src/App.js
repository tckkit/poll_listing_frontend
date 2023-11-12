import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import RootLayout from "./pages/rootLayout/Rootlayout";

export const path = {
  INDEX: "/",
  POLL: "/poll",
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path={path.INDEX}
      element={<RootLayout />}
      errorElement={<div>Errors occuried!</div>}
    >
      <Route index element={<Navigate to="/poll" />} />

      <Route path={path.POLL} element={<Outlet />}>
        <Route index lazy={() => import("./pages/poll/Listings")} />
        <Route path=":pollId" lazy={() => import("./pages/poll/Details")} />
      </Route>
      <Route path="*" element={<>404 NOT FOUND</>} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
