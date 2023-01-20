import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../../util/createPostgresClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    
    const teamData = (await postgresClient.query(`SELECT * FROM teams WHERE "teamID" = $1`, [req.query.teamid])).rows[0]    

    const tempMemebersArray = [];

    const ownerData = (await postgresClient.query(`SELECT "userID", "userNick" from users WHERE "userID" = $1`, [teamData.teamOwner])).rows[0]

    teamData.teamOwner = ownerData;

    for (const member of teamData.teamMembers) {
        const userNick = (await postgresClient.query(`SELECT "userNick" from users WHERE "userID" = $1`, [member])).rows[0].userNick;
        tempMemebersArray.push({
            userID: member,
            userNick: userNick
        })
    }

    teamData.teamMembers = tempMemebersArray;

    return res.status(200).send({ teamData: teamData })
    
}
