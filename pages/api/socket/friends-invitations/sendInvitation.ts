import postgresClient from "../../../../util/createPostgresClient";
import generateInvitationID from "../../../../util/generateInvitationID";

export default async function sendInvitation(data: any) {
    const senderUserID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [data.userToken])).rows[0].userID;

    await postgresClient.query(`INSERT INTO public."friends-invitations"(
        "invitationID", "invitationSender", "invitationReceiver", "invitationDate")
        VALUES ($1, $2, $3, now());`, [await generateInvitationID(postgresClient, "friends"), senderUserID, data.receiverUserID])
}