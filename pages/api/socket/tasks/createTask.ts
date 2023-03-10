
import postgresClient from '../../../../util/createPostgresClient';
import generateTaskID from '../../../../util/generateTaskID';



export default async function createTask(data: any) {
    const taskData = data
     
    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [taskData.userToken])).rows[0].userID;

    await postgresClient.query(`INSERT INTO tasks("taskID", "taskTeamID", "taskTitle", "taskDescription", "taskStatus", "taskDate", "taskCreator", "taskResponsibleUsers") 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`, 
    [await generateTaskID(postgresClient), taskData.teamID, taskData.taskTitle, taskData.taskDescription, "to do", taskData.taskDate, userID, taskData.taskResponsibleUsers])
    
}
