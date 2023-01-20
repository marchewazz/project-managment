import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../../../util/createPostgresClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const invitationData = JSON.parse(req.body);
    
    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [invitationData.userToken])).rows[0].userID
    const teamID = (await postgresClient.query(`SELECT "invitationTeamID" from invitations WHERE "invitationID" = $1`, [invitationData.invitationID])).rows[0].invitationTeamID;
    
    await postgresClient.query(`UPDATE teams SET "teamMembers" = array_append("teamMembers", $1) WHERE "teamID" = $2`, [userID, teamID])

    return res.status(200).send({ message: "inserted", teamID: teamID })
    
}
