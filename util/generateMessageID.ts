import { randomBytes } from "crypto";
import { Pool } from "pg";

export default async function generateMessageID(client: Pool): Promise<string> {
    let id: string = "";
    while (true) {
        id = randomBytes(10).toString("hex");
        const { rows } = await client.query(`SELECT COUNT(*) AS AMOUNT FROM messages WHERE "messageID" = $1`, [id]);
        if (Number(rows[0].amount) === 0) break
    }
    return id
}