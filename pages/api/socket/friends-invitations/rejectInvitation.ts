import postgresClient from "../../../../util/createPostgresClient";

export default async function rejectInvitation(data: any) {    
    await postgresClient.query(`DELETE FROM "friends-invitations" WHERE "invitationID"=$1;`, [data.invitationID])
}