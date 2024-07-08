import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateMail from './Pages/CreateMail';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import ExtendSub from './Pages/ExtendSub';
import PickUsername from './Pages/PickUsername';
import NamesList from './Pages/NamesList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PickUsername />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-mail" element={<CreateMail />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/extend-subscription" element={<ExtendSub />} />
        <Route path='/registered-names' element={<NamesList/>} />
      </Routes>
    </Router>
  );
}

export default App;
