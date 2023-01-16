import { randomBytes } from "crypto";
import { Pool } from "pg";

export default async function generateInvitationID(client: Pool): Promise<string> {
    let id: string = "";
    while (true) {
        id = randomBytes(10).toString("hex");
        const { rows } = await client.query(`SELECT COUNT(*) AS AMOUNT FROM invitations WHERE "invitationID" = $1`, [id]);
        if (Number(rows[0].amount) === 0) break
    }
    return id
}