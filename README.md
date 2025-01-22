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