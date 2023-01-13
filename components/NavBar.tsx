import { useRouter } from "next/router";

export default function NavBar() {

    const router = useRouter();

    return (
        <>
            <button className="bg-red-700"
            onClick={() => router.push("/register")}>
              Register
            </button>
            <button className="bg-blue-700"
            onClick={() => router.push("/login")}>
              Login
            </button>
        </>
    )
}
