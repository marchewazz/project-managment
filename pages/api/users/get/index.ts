import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../../util/createPostgresClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const userData = JSON.parse(req.body);   
    
    let userID

    if ("userToken" in userData) {
        userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [userData.userToken])).rows[0].userID;
    } else {
        userID = userData.userID;
    }

    const userDBData = await (await postgresClient.query(`SELECT "userNick", "userFirstName", "userLastName", "userEmail", "userCreateData", "userID", "userFriends" FROM users WHERE "userID" = $1;`,
        [userID])).rows[0]

    return res.status(200).send({ userData: userDBData })
    
}
