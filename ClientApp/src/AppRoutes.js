import Home from "./pages/Home/Home";
import Reminders from "./pages/Reminders/Reminders";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/Reminders',
    element: <Reminders />
  },
];

export default AppRoutes;
