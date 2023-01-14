import { compareSync } from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../util/createPostgresClient';
import generateToken from '../../../util/generateToken';

type Message = {
    message: string,
    token?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
    const userData = JSON.parse(req.body);
    await postgresClient.connect();
    
    let dbUserData;

    if ("userNick" in userData) {
        dbUserData = await (await postgresClient.query(`SELECT * FROM users WHERE "userNick" = $1`, [userData.userNick])).rows[0];
    } 
    if ("userEmail" in userData) {
        dbUserData = await (await postgresClient.query(`SELECT * FROM users WHERE "userEmail" = $1`, [userData.userEmail])).rows[0];
    }
    if (!dbUserData) return res.status(200).json({ message: 'User does not exist' })
    
    if (compareSync(userData.userPassword, dbUserData.userPassword)) return res.status(200).json({ message: 'Logged', token: await generateToken(postgresClient, dbUserData.userID) })
    return res.status(200).json({ message: 'Wrong passoword' })
    
}
