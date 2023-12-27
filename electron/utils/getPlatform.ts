export default function getPlatform() {
    switch (process.platform) {
        case 'linux':
            return 'linux'
        case 'win32':
            return 'windows'
        case 'darwin':
            return 'macOS'
        default:
            // defaulting for linux (most probable command syntax)
            return 'linux'
    }
}