import { randomBytes } from "crypto";
import { Pool } from "pg";

export default async function generateToken(client: Pool, userID: string): Promise<string> {
    let token: string = "";
    while (true) {
        token = randomBytes(24).toString("hex");
        const { rows } = await client.query(`SELECT COUNT(*) AS AMOUNT FROM tokens WHERE "token" = $1`, [token]);
        if (Number(rows[0].amount) === 0) break
    }
    
    await client.query(`INSERT INTO tokens ("token", "userID", "expiringDate") VALUES ($1, $2, now() + interval '168 hours');`, [token, userID])
    return token
}