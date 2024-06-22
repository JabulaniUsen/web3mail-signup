import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupForm from './Pages/SignupForm';
import CreateMail from './Pages/CreateMail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/create-mail" element={<CreateMail />} />
      </Routes>
    </Router>
  );
}

export default App;
