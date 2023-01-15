import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../../util/createPostgresClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    await postgresClient.connect();
    
    const teamData = (await postgresClient.query(`SELECT * FROM teams WHERE "teamID" = $1`, [req.query.teamid])).rows[0]    

    return res.status(200).send({ teamData: teamData })
    
}
