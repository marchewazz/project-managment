import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../../../util/createPostgresClient';
import generateInvitationID from '../../../../../util/generateInvitationID';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const invitationData = JSON.parse(req.body);
    
    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [invitationData.userToken])).rows[0].userID
    const invitationID = await generateInvitationID(postgresClient, "team");

    await postgresClient.query(`INSERT INTO "team-invitations" ("invitationID", "invitationSender", "invitationTeamID") VALUES ($1, $2, $3);`, 
    [invitationID, userID, invitationData.teamID])

    return res.status(200).send({ invitationID: invitationID })
    
}
