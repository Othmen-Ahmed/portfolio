// Middleware used to open the mail app When email is clicked
// Usage <Mailto label="Displayed text" mailto="mailto:donotremove@mailto.com" />

import React from "react";
import { Link } from "react-router-dom";

const Mailto = ({ mailto, label }) => {
    return (
        <Link
            to='#'
            onClick={(e) => {
                window.location.href = mailto;
                e.preventDefault();
            }}
        >
            {label}
        </Link>
    );
};

export default Mailto;