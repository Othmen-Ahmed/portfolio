import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NotFound from './Components/NotFound';
import Home from './Components/Home';
import Projects from './Components/Projects';
import ProjectDetail from './Components/ProjectDetail';
import KilnSimulator from './Components/Simulator/KilnSimulator';
import Stats from './Components/Stats';
import { trackVisit } from './analytics';

// Reports each page view to the visitor counter (the private stats page is not counted)
const VisitTracker = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/') trackVisit('home');
    if (pathname.startsWith('/projects')) trackVisit('projects');
    if (pathname === '/simulator') trackVisit('simulator');
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <VisitTracker />
      <Routes>
        {/* Home component is rendered when visiting the root URL */}
        <Route path="/" element={<Home/>} />

        {/* Projects: one blog-like page per project */}
        <Route path="/projects" element={<Projects/>} />
        <Route path="/projects/:slug" element={<ProjectDetail/>} />

        {/* Interactive kiln operator training simulator */}
        <Route path="/simulator" element={<KilnSimulator/>} />

        {/* Private visitor statistics, not linked anywhere */}
        <Route path="/stats" element={<Stats/>} />

        {/* If component is not found navigate to NotFound page error 404 */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
}

export default App;
