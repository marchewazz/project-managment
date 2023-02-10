import postgresClient from "../../../../util/createPostgresClient";

export default async function getInvitations(data: any) {
    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [data.userToken])).rows[0].userID;

    const { rows } = await postgresClient.query(`SELECT "invitationID", "invitationSender", "invitationReceiver", "invitationDate"
	FROM "friends-invitations"
    WHERE "invitationSender"=$1 OR "invitationReceiver"=$1;`, [userID])

    for (const row of rows) {
        console.log(row, userID);
        
        if (row.invitationSender == userID) row.isUserSender = true
        else row.isUserSender = false
    }
    
    return rows
}