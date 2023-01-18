import postgresClient from '../../../../util/createPostgresClient';
import generateMessageID from '../../../../util/generateMessageID';

export default async function insertMessage(data: any) {

    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [data.userToken])).rows[0].userID;
   
    await postgresClient.query(`INSERT INTO messages ("messageID", "messageText", "messageSender", "messageReceiver", "messageDate")
    VALUES ($1, $2, $3, $4, now());`, [await generateMessageID(postgresClient), data.message, userID, data.teamID]);
}