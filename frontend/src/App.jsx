import { ExerciseScreen } from "./pages";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomeScreen />,
  },
  {
    path: "/exercise",
    element: <ExerciseScreen />,
  }
]);


function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
