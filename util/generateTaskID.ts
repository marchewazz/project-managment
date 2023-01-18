import { randomBytes } from "crypto";
import { Pool } from "pg";

export default async function generateTaskID(client: Pool): Promise<string> {
    let id: string = "";
    while (true) {
        id = randomBytes(5).toString("hex");
        const { rows } = await client.query(`SELECT COUNT(*) AS AMOUNT FROM tasks WHERE "taskID" = $1`, [id]);
        if (Number(rows[0].amount) === 0) break
    }
    return id
}