import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../../../util/createPostgresClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {

    const invitationData = JSON.parse(req.body);

    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [invitationData.userToken])).rows[0].userID

    const invitationDBData = await (await postgresClient.query(`SELECT "invitationSender", "userNick", "teamName", "teamMembers" 
    FROM "team-invitations"
    INNER JOIN users ON "team-invitations"."invitationSender"=users."userID"
    INNER JOIN teams ON "team-invitations"."invitationTeamID"=teams."teamID"
    WHERE "invitationID" = $1`, [invitationData.invitationID])).rows[0]    
    
    if (!invitationDBData) return res.status(200).send({ message: "no invitation" })
    if (userID == invitationDBData.invitationSender || invitationDBData.teamMembers.includes(userID)) return res.status(200).send({ message: "you are in this team" })

    return res.status(200).send({ message: "invitation", invitationData: invitationDBData })
    
}
