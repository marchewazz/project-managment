import postgresClient from "../../../../util/createPostgresClient";

export default async function getUpcomingUserTasks(data: any) {

    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [data.userToken])).rows[0].userID;

    const tasks = (await postgresClient.query(`SELECT *, "userNick" from tasks 
    INNER JOIN users
    ON tasks."taskCreator"=users."userID"
    WHERE ($1=ANY("taskResponsibleUsers") OR "taskCreator"=$1) AND "taskDate" - now() > INTERVAL '0 0:00:00.000'`, [userID])).rows;
   
    return tasks
}