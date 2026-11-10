import React from 'react'

const Header = () => {
  return (
    <div>
      <header className="header">
  <div className="container">
    <ul className="social-icons pt-3 algin-items-left">
      <li className="social-item"><a className="social-link text-light" href="https://github.com/Othmen-Ahmed"><i className="ti-github" aria-hidden="true" /></a></li>
      <li className="social-item"><a className="social-link text-light" href="https://www.linkedin.com/in/othmen-ahmed/"><i className="ti-linkedin" aria-hidden="true" /></a></li>
    </ul>  
    <div className="header-content">
      <h4 className="header-subtitle">Hello, I am</h4>
      <h1 className="header-title">Ahmed Othman</h1>
      <h6 className="header-mono">Maintenance Manager | Siemens PCS7 | PLC/SCADA | Industry 4.0</h6>
      <h6 className="header-mono">Experienced in Maintenance management, electrical systems and digital integration.</h6>

    </div>
  </div>
</header>
    </div>
  )
}

export default Header
