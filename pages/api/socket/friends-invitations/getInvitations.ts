import postgresClient from "../../../../util/createPostgresClient";

export default async function getInvitations(data: any) {
    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [data.userToken])).rows[0].userID;

    const { rows } = await postgresClient.query(`SELECT "invitationID", "invitationSender", "invitationReceiver", "invitationDate"
	FROM "friends-invitations"
    WHERE "invitationSender"=$1 OR "invitationReceiver"=$1;`, [userID])

    for (const row of rows) {
        if (row.invitationSender == userID) row.isUserSender = true
        else row.isUserSender = false

        const senderNick = (await postgresClient.query(`SELECT "userNick" from users WHERE "userID" = $1`, [row.invitationSender])).rows[0].userNick;
        const receiverNick = (await postgresClient.query(`SELECT "userNick" from users WHERE "userID" = $1`, [row.invitationReceiver])).rows[0].userNick;

        row.invitationSender = {
            userID: row.invitationSender,
            nick: senderNick
        }

        row.invitationReceiver = {
            userID: row.invitationReceiver,
            nick: receiverNick
        }

    }
    
    return rows
}