import postgresClient from '../../../../util/createPostgresClient';

export default async function deleteTask(taskID: any) {
    
    await postgresClient.query(`DELETE FROM "tasks"
    WHERE "taskID" = $1`, [taskID]);
   
}