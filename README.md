# Welcome to my portfolio react app

This project is a digital version of my resume used to showcase in depth my experience as well as my personal projects.


This project is based on the free html template "john doe" `https://plantillashtmlgratis.com/en/todas-las-plantillas/plantilla/free-html-css-template-john-doe/`

## Where things are

| To change | Edit |
| --- | --- |
| Projects (home cards, `#/projects`, each project page) | `src/data/projects.js`, photos in `public/assets/imgs/projects/<slug>/` |
| Experience, education, skills, certifications | `src/Components/Resume.jsx` |
| Introduction, contact details, expertise | `src/Components/Home.jsx`, `src/Components/Header.jsx` |
| Resume PDFs behind the two buttons | `public/assets/pdf/` |

## Visitor dashboard

The private page `#/stats` reads a Cloudflare Worker (`counter-worker/worker.js`) backed by a D1 database.

To update the Worker: Cloudflare dashboard > Workers > `portfolio-counter` > Edit code,
paste the content of `counter-worker/worker.js`, Deploy. The Worker creates its new
table by itself and copies the old counts into it; the bindings (`DB`, `SALT`,
`ADMIN_KEY`, `ALLOWED_ORIGIN`) stay as they are.

To know which link brought a visitor, share tagged addresses such as
`https://othmen-ahmed.github.io/portfolio/?ref=cv` or `?ref=linkedin`.
