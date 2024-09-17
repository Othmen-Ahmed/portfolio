import React from 'react';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Components/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home component is rendered when visiting the root URL */}
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
