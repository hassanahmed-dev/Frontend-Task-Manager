import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
import Signpage from "./pages/Signpage";
import Dashboardpage from "./pages/Dashboardpage";
import Calendarpage from './pages/Calendarpage'
import Forgotpage from "./pages/Forgotpage";
import ResetPassword from "./pages/Resetpage";
import Profilepage from "./pages/Profilepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signpage />} />
        <Route path="/forgot-password" element={<Forgotpage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<Dashboardpage />} />
        <Route path="/calendar" element={<Calendarpage/>} />
        <Route path="/profile" element={<Profilepage/>}/>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;