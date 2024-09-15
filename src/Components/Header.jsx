import React from 'react'

const Header = () => {
  return (
    <div>
      <header className="header">
  <div className="container">
    <ul className="social-icons pt-3 algin-items-left">
      <li className="social-item"><a className="social-link text-light" href="#"><i className="ti-github" aria-hidden="true" /></a></li>
      <li className="social-item"><a className="social-link text-light" href="#"><i className="ti-linkedin" aria-hidden="true" /></a></li>
    </ul>  
    <div className="header-content">
      <h4 className="header-subtitle">Hello, I am</h4>
      <h1 className="header-title">Ahmed Othman</h1>
      <h6 className="header-mono">OT Engineer | Mechatronics Engineer</h6>
      <button className="btn btn-primary btn-rounded"><i className="ti-printer pr-2" />Print Resume</button>
    </div>
  </div>
</header>
    </div>
  )
}

export default Header
