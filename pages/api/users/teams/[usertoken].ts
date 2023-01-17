import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../../util/createPostgresClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    await postgresClient.connect();

    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [req.query.usertoken])).rows[0].userID;
  

    const userTeams = (await postgresClient.query(`SELECT "teamID", "teamName" FROM teams WHERE "teamOwner" = $1 OR $1 = ANY("teamMembers");`, [userID])).rows;

    return res.status(200).send({ teams: userTeams })
    
}
