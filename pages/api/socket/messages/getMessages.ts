import postgresClient from '../../../../util/createPostgresClient';

export default async function getMessages(data: any) {

    const messages = (await postgresClient.query(`SELECT *, "userNick" from messages 
    INNER JOIN users 
    ON messages."messageSender"=users."userID"
    WHERE "messageReceiver" = $1`, [data.teamID])).rows

    return messages
}