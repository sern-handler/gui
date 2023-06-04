module.exports = {
  packagerConfig: {
    icon: './icons/icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './icons/icon.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
};
