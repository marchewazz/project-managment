import { randomBytes } from "crypto";
import { Pool } from "pg";

export default async function generateInvitationID(client: Pool, type: "team" | "friends"): Promise<string> {
    let id: string = "";
    while (true) {
        id = randomBytes(10).toString("hex");
        let rows = [];
        if (type === "team") {
            rows = await (await client.query(`SELECT COUNT(*) AS AMOUNT FROM "team-invitations" WHERE "invitationID" = $1`, [id])).rows;
        }
        if (type === "friends") {
            rows = await (await client.query(`SELECT COUNT(*) AS AMOUNT FROM "friends-invitations" WHERE "invitationID" = $1`, [id])).rows;
        }
        if (Number(rows[0].amount) === 0) break
    }
    return id
}