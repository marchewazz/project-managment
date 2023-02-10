import postgresClient from "../../../../util/createPostgresClient";

export default async function acceptInvitation(data: any) {
    const invitation = await (await postgresClient.query(`SELECT "invitationID", "invitationSender", "invitationReceiver"
	FROM "friends-invitations" WHERE "invitationID"=$1;`, [data.invitationID])).rows[0]

    await postgresClient.query(`UPDATE "users" SET "userFriends" = array_append("userFriends", $1) WHERE "userID" = $2`, [invitation.invitationSender, invitation.invitationReceiver])
    await postgresClient.query(`UPDATE "users" SET "userFriends" = array_append("userFriends", $1) WHERE "userID" = $2`, [invitation.invitationReceiver, invitation.invitationSender])
    await postgresClient.query(`DELETE FROM "friends-invitations" WHERE "invitationID"=$1;`, [data.invitationID])
    
}