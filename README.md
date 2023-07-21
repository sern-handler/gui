# gui
yet another way to manage your sern projects!

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/sern-handler/gui)

# why do u use electron!?!?! switch to tauri!! im mad uwu (；⌣̀_⌣́)

[answer](https://memz.willysuna.dev/stfu.mp4)

# where's the electron code?

electron/index.ts

# how do I build the app?

`yarn build-electron` ([tested on linux](https://gist.github.com/SrIzan10/50bc2ba689a4cc43bcbac2799cc733c9). `wine` must be installed to build windows packages)  
`yarn build-electron-windows` (not tested but should work. use this if on windows. only builds windows packages)  
`yarn build-electron-mac`

# CI builds?

CI builds are a WIP. We have working Linux and Windows CircleCI workflows in place, but build artifacts are still not implemented.  
The project is in a very early stage and currently I build binaries on my host computer.  
I know this is annoying, but you should build yourself the app (which you can do by following the last question)