import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateMail from './Pages/CreateMail';
import SignUp from './Pages/SignUp';
import ExtendSub from './Pages/ExtendSub';
import PickUsername from './Pages/PickUsername';
import NamesList from './Pages/NamesList';
import CreateMailist from './Pages/CreateMailist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PickUsername />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-mail" element={<CreateMail />} />
        <Route path="/extend-subscription" element={<ExtendSub />} />
        <Route path='/registered-names' element={<NamesList/>} />
        <Route path='/create-mailist' element={<CreateMailist/>} />
      </Routes>
    </Router>
  );
}

export default App;
