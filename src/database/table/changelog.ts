import { Generated, InferResult } from "kysely"
import { databaseClient } from "..";

export type ChangelogTable = {
    id: Generated<number>,
    version: string,
    title: string,
    description: string,
    features: Array<{
        title: string,
        description?: string
    }>
};

/**
 * 
 * Inserts a new changelog instance record into the database.
 * @param data changelog object
 */
export const create = async (data: Omit<ChangelogTable, "id">) => {
    await databaseClient()
        .insertInto("changelog")
        .values({
            title: data["title"],
            description: data["description"],
            version: data["version"],
            features: data["features"]
        })
        .execute();
}

/**
 * 
 * @param id changelog id
 */
export const remove = async (id: number) => {
    await databaseClient()
        .deleteFrom("changelog")
        .where('changelog.id', '=', id)
        .execute();
}

/**
 * 
 * @param id currently existing chagnelog id.
 * @param newInstance a new instance needed to be replaced.
 */
export const update = async (
    id: number,
    newInstance: Omit<ChangelogTable, "id">
) => {
    await databaseClient()
        .updateTable("changelog")
        .set({
            title: newInstance["title"],
            description: newInstance["description"],
            version: newInstance["version"],
            features: newInstance["features"]
        })
        .where('changelog.id', '=', id)
        .execute();
}

/**
 * 
 * @returns a list of changelog objects
 */
export const list = async () => {
    return await databaseClient()
        .selectFrom("changelog")
        .selectAll()
        .execute()
}

/**
 * 
 * @param request 
 * a request type. If request is id, then we will retrieve an changelog object
 * by the id, if type is title, then we get it by title.
 * @returns single changelog instance element.
 */
export const getBy = async (request: 
    | { type: "id", id: number }
    | { type: "title", title: string }
) => {
    if(request.type === "id") {
        return await databaseClient()
            .selectFrom('changelog')
            .selectAll()
            .where('changelog.id', '=', request.id)
            .executeTakeFirst();
    }

    else return await databaseClient()
        .selectFrom("changelog")
        .selectAll()
        .where('changelog.title', '=', request.title)
        .executeTakeFirst();
}