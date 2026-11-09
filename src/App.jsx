import React from 'react';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import NotFound from './Components/NotFound';
import Home from './Components/Home';
import KilnSimulator from './Components/Simulator/KilnSimulator';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home component is rendered when visiting the root URL */}
        <Route path="/" element={<Home/>} />

        {/* Interactive kiln operator training simulator */}
        <Route path="/simulator" element={<KilnSimulator/>} />

        
        {/* If component is not found navigate to NotFound page error 404 */}
        <Route path="*" element={<NotFound/>} />

      </Routes>
    </Router>
  );
}

export default App;
