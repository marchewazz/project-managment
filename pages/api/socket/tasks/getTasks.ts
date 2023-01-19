import postgresClient from '../../../../util/createPostgresClient';

export default async function getTasks(teamID: any) {
    
    const tasks = (await postgresClient.query(`SELECT *, "userNick" from tasks 
    INNER JOIN users
    ON tasks."taskCreator"=users."userID"
    WHERE "taskTeamID" = $1`, [teamID])).rows;
   
    return tasks
}