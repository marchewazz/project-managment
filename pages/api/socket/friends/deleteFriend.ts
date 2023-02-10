import postgresClient from "../../../../util/createPostgresClient";

export default async function deleteFriend(data: any) {
    const userID = (await postgresClient.query(`SELECT "userID" from tokens WHERE "token" = $1`, [data.userToken])).rows[0].userID;
    
    await postgresClient.query(`UPDATE "users" SET "userFriends" = array_remove("userFriends", $1) WHERE "userID" = $2`, [data.friendID, userID])
    await postgresClient.query(`UPDATE "users" SET "userFriends" = array_remove("userFriends", $1) WHERE "userID" = $2`, [userID, data.friendID])
}