import postgresClient from '../../../../util/createPostgresClient';

export default async function editTask(data: any) {
    await postgresClient.query(`UPDATE tasks
	SET "taskTitle"=$2, "taskDescription"=$3, "taskStatus"=$4, "taskDate"=$5, "taskCreator"=$6, "taskResponsibleUsers"=$7, "taskTeamID"=$8
	WHERE "taskID"=$1;`, [data.taskID, data.taskTitle, data.taskDescription, data.taskStatus, data.taskDate, data.taskCreator, data.taskResponsibleUsers, data.taskTeamID]);
}