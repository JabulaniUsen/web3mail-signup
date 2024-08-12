import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Components/Navbar';
import CreateMail from './Pages/CreateMail';
import SignUp from './Pages/SignUp';
import ExtendSub from './Pages/ExtendSub';
import PickUsername from './Pages/PickUsername';
import NamesList from './Pages/NamesList';
import CreateMailist from './Pages/CreateMailist';
import AvailiableNewsletters from './Pages/AvailiableNewsletters';
import PostPage from './Pages/PostPage';

function App() {
  const [registerComplete, setRegisterComplete] = useState(false);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PickUsername />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-mail" element={<CreateMail setRegisterComplete={setRegisterComplete} />} />
        <Route path="/extend-subscription" element={<ExtendSub />} />
        <Route path='/registered-names' element={<NamesList/>} />
        <Route path='/create-mailist' element={<CreateMailist/>} />
        <Route path='/availiable-newsletters' element={<AvailiableNewsletters/>} />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
