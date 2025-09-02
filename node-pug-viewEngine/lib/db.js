import { readFile, writeFile } from "fs/promises"
const PATH = "./lib/data.json"

export const readAll = async () => {
    const users = await readFile(PATH, "utf-8")
    if(!users.trim()) return [];
    return JSON.parse(users);
}

export const save = async (user) => {
    let users = await readAll(PATH)
    users.push(user)

    await writeFile(PATH, JSON.stringify(users))

}