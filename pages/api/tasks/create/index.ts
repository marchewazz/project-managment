import type { NextApiRequest, NextApiResponse } from 'next'
import postgresClient from '../../../../util/createPostgresClient';
import generateTaskID from '../../../../util/generateTaskID';

type Message = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
    const taskData = JSON.parse(req.body);
    await postgresClient.connect();
     
    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [taskData.userToken])).rows[0].userID;

    await postgresClient.query(`INSERT INTO tasks("taskID", "taskTitle", "taskDescription", "taskStatus", "taskDate", "taskCreator", "taskResponsibleUsers") 
    VALUES ($1, $2, $3, $4, $5, $6, $7);`, 
    [await generateTaskID(postgresClient), taskData.taskTitle, taskData.taskDescription, "to do", taskData.taskDate, userID, taskData.taskResponsibleUsers])

    return res.status(200).send({ message: "Task created" })
    
}
