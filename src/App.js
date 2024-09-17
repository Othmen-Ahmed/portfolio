import React from 'react';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import NotFound from './Components/NotFound';
import Home from './Components/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home component is rendered when visiting the root URL */}
        <Route path="/" element={<Home/>} />

        
        {/* If component is not found navigate to NotFound page error 404 */}
        <Route path="*" element={<NotFound/>} />

      </Routes>
    </Router>
  );
}

export default App;
