import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NotFound from './Components/NotFound';
import Home from './Components/Home';
import KilnSimulator from './Components/Simulator/KilnSimulator';
import ProjectList from './Components/Projects/ProjectList';
import ProjectPost from './Components/Projects/ProjectPost';
import Stats from './Components/Stats';
import { trackVisit } from './analytics';
import { findProject } from './data/projects';

// Name under which each page is counted (the private stats page is not counted)
const pageName = (pathname) => {
  if (pathname === '/') return 'home';
  if (pathname === '/simulator') return 'simulator';
  if (pathname === '/projects') return 'projects';
  const project = pathname.match(/^\/projects\/([a-z0-9-]+)$/);
  if (project && findProject(project[1])) return `project:${project[1]}`;
  return null;
};

// Reports each page view to the visitor counter
const VisitTracker = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pageName(pathname);
    if (page) trackVisit(page);
  }, [pathname]);
  return null;
};

// Opens every page at its top, unless the link asked for a section of the home page
const ScrollToTop = () => {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (!(state && state.scrollTo)) window.scrollTo(0, 0);
  }, [pathname, state]);
  return null;
};

function App() {
  return (
    <Router>
      <VisitTracker />
      <ScrollToTop />
      <Routes>
        {/* Home component is rendered when visiting the root URL */}
        <Route path="/" element={<Home/>} />

        {/* Projects: the list, then one page per project */}
        <Route path="/projects" element={<ProjectList/>} />
        <Route path="/projects/:slug" element={<ProjectPost/>} />

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
