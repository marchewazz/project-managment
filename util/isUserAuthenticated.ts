export default function isUserAuthenticated(): boolean {
    if (!localStorage.getItem("token")) return false
    return true
}