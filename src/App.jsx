import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateMail from './Pages/CreateMail';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/create-mail" element={<CreateMail />} />
        <Route path="/login" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
