import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateMail from './Pages/CreateMail';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import ExtendSub from './Pages/ExtendSub';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/create-mail" element={<CreateMail />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/Extend-subscribtion" element={<ExtendSub/>} />
      </Routes>
    </Router>
  );
}

export default App;
