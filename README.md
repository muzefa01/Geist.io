# Northcoders Project Phase

Welcome!

This group project was created in the final three weeks of a Software Development in JavaScript Skills Bootcamp, provided by [Northcoders](https://northcoders.com).

You can view the hosted application here: [Geist.io](https://geist-io.onrender.com).

Our group, Zeitgeist, consists of six members: Syed Muzefa Abbas, arda caglar, Christopher Dobson, Muhammad Hasan, Brandon Hinds and Aaron Smith. We began by considering the Software Development Lifestyle (SDLC) of our app.

Throughout the project phase, we communicated with one another through Slack, Zoom, Discord and Google Docs. Every morning from 8.45-9.15AM, we held a stand-up session over video call, this involved updating each other on our progress since our last call. We also held round-down sessions every afternoon from 4.30-5PM.

Each of us cloned [the same GitHub repository](https://github.com/muzefa01/Geist.io) to our local machines. We each created our own branches and created pull requests when we wanted to merge changes into the main branch. Clear communication ensured consistency between our code.

The minimum viable product (MVP) we devised was an online multiplayer video game called Geist.io. This game sees two players choose a randomly generated spirit and do battle against one another.

Among the dependencies we installed for this project are Express, Phaser and Socket.IO. Geist.io was hosted on [Netlify](https://geist-io.netlify.app/) and [Render](https://geist-io.onrender.com/). If you would like to open Geist.io in your local host using Vite, you can do so with the following commands:

1. npm install
1. npm run dev

---

FOR DEV:
  in vite.config.js,
  use the localhost target

  in src/scenes/StartMatch.js,
  use the blank io() in preload()

FOR RENDER:
  in vite.config.js,
  use the geist-io.onrender target

  in src/scenes/StartMatch.js,
  use the io('https://geist-io..') in preload()