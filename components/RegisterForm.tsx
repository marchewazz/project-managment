import { useState } from "react";

export default function RegisterForm() {
    
    const [info, setInfo] = useState("")

    async function registerUser(event: any): Promise<void> {
        event.preventDefault();
        
        if (event.target.password.value != event.target.repeatedPassword.value) {
            setInfo("Password are not the same");
        } else {
            const userData = {
                userNick: event.target.nick.value,
                userEmail: event.target.email.value,
                userFirstName: event.target.firstName.value,
                userLastName: event.target.lastName.value,
                userPassword: event.target.password.value,
            } 
            const req = await fetch("/api/register", { method: "POST", body: JSON.stringify(userData) })
            const res = await req.json();
            setInfo(res.message);
        }
    }

    return (
        <>
            <form className="bg-red-700 p-2 grid grid-flow-col gap-2"
            onSubmit={registerUser}>
                <input type="text" 
                placeholder="Nick" 
                name="nick"
                minLength={4}
                maxLength={20}
                required 
                />
                <input type="email" 
                name="email"
                placeholder="Email" 
                required 
                />
                <input type="text" 
                name="firstName"
                placeholder="First name" 
                maxLength={50}
                required 
                />
                <input type="text" 
                name="lastName"
                placeholder="Last name" 
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
                <input type="password" 
                name="repeatedPassword"
                placeholder="Repeat passowrd"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
                title="Miniumum 1 number, 1 uppercase, 1 lowercase, 8 characters long"
                required 
                />
                <button>
                    REGISTER
                </button>
            </form>
            <p>
                { info }
            </p>
        </>
    )
}
