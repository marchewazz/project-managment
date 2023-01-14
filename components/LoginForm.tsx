import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginForm() {

    const [info, setInfo] = useState("")

    const router = useRouter();

    async function loginUser(event: any): Promise<void> {
        event.preventDefault();
        
        let userData: any = {
            userPassword: event.target.password.value
        }

        if (event.target.nickOrEmail.value.indexOf("@") > -1) userData["userEmail"] = event.target.nickOrEmail.value
        else userData["userNick"] = event.target.nickOrEmail.value
        
        const req = await fetch("/api/login", { method: "POST", body: JSON.stringify(userData) })
        const res = await req.json();

        if (res.message == "Logged") {
            localStorage.setItem("token", res.token)
            router.push("/dashboard");
        } else {
            setInfo(res.message)
        }
    
    }

    return (
        <>
            <form className="bg-blue-700 p-2 grid grid-flow-col gap-2"
            onSubmit={loginUser}>
                <input type="text" 
                placeholder="Nick or email" 
                name="nickOrEmail"
                minLength={4}
                maxLength={50}
                required 
                />
                <input type="password" 
                name="password"
                placeholder="Password" 
                minLength={8}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
                title="Miniumum 1 number, 1 uppercase, 1 lowercase, 8 characters long"
                required 
                />
                <button>
                    LOGIN
                </button>
            </form>
            <p>
                { info }
            </p>
        </>
    )
}