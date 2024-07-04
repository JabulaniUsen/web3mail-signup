import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateMail from './Pages/CreateMail';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import ExtendSub from './Pages/ExtendSub';
import PickUsername from './Pages/PickUsername';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-mail" element={<CreateMail />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/Extend-subscribtion" element={<ExtendSub/>} />
        <Route path="/" element={<PickUsername/>} />
      </Routes>
    </Router>
  );
}

export default App;
