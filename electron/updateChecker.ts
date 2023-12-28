import { app } from "electron"

export default async function updateChecker() {
    const getLatest = await fetch('https://api.github.com/repos/sern-handler/gui/releases/latest')
        .then(res => res.json())

    if (`v${app.getVersion()}` !== getLatest.tag_name) {
        return { version: getLatest.tag_name as string, url: getLatest.html_url as string }
    } else {
        return false
    }
}