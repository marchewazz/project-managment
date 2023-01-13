import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../util/createPostgresClient';
import generateUserID from '../../../util/generateUserID';

type Message = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
    const userData = JSON.parse(req.body);
    await postgresClient.connect();

    let userWithPassedEmail = await (await postgresClient.query(`SELECT COUNT(*) AS "amount" FROM users WHERE "userEmail" = $1`, [userData.userEmail])).rows[0].amount;    
    if (Number(userWithPassedEmail) != 0) return res.status(200).json({ message: 'Email is taken' })

    let userWithPassedNick = await (await postgresClient.query(`SELECT COUNT(*) AS AMOUNT FROM users WHERE "userNick" = $1`, [userData.userNick])).rows[0].amount;
    if (Number(userWithPassedNick) != 0) return res.status(200).json({ message: 'Nick is taken' })

    const values = [await generateUserID(postgresClient), userData.userNick, userData.userFirstName, userData.userLastName, userData.userEmail, userData.userPassword];
    await postgresClient.query(`INSERT INTO "users" ("userID", "userNick", "userFirstName", "userLastName", "userEmail", "userCreateData", "userPassword") VALUES ($1, $2, $3, $4, $5, now(), $6);`, values);
    res.status(200).json({ message: 'Registered' })
}
