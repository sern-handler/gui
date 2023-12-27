import { app } from "electron"
import getPlatform from "./utils/getPlatform.js"

export default async function updateChecker() {
    const currentOS = getPlatform()
    const getLatest = await fetch('https://api.github.com/repos/sern-handler/gui/releases/latest')
        .then(res => res.json())
    
    const dlUrl = getLatest.assets.map((asset) => {
        switch (asset.content_type) {
            case 'application/x-msdownload':
                return 'windows'
            case 'application/vnd.appimage':
                return 'linux'
            case 'application/x-apple-diskimage':
                return 'macOS'
            default:
                return null
        }
    })

    if (`v${app.getVersion()}` !== getLatest.tag_name) {
        return { version: getLatest.tag_name as string, url: getLatest.html_url as string }
    } else {
        return false
    }
}