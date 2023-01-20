import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../../util/createPostgresClient';
import generateTeamID from '../../../../util/generateTeamID';

type Message = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
    const teamData = JSON.parse(req.body);
     
    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [teamData.userToken])).rows[0].userID;

    await postgresClient.query(`INSERT INTO teams("teamID", "teamName", "teamOwner", "teamMembers") VALUES ($1, $2, $3, $4);`, 
    [await generateTeamID(postgresClient), teamData.teamName, userID, []])

    return res.status(200).send({message: "Team created"})
    
}
