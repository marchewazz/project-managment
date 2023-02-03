import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../../util/createPostgresClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    
    const teamData = (await postgresClient.query(`SELECT * FROM teams WHERE "teamID" = $1`, [req.query.teamid])).rows[0]    
    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [JSON.parse(req.body).userToken])).rows[0].userID;

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
    
    if (!teamData.teamMembers.some((member: any) => member.userID == userID) && teamData.teamOwner.userID != userID) {
        return res.status(200).send({ message: "you are not in the team" })
    } else {
        return res.status(200).send({ message: "ok", teamData: teamData })
    }
    
}
