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

Builds will be set up using a jetbrains teamcity instance when migration to new server is done. ETA still not known. Packaged binaries are built on my host computer for now. If you're skeptical, build the app for yourself.
