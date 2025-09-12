import { readFile, writeFile } from "fs/promises"
const PATH = "./lib/data.json"

export const getAllUsers = async () => {
    const result = await readFile(PATH, "utf-8")
    if(!result.trim()) return []
    return JSON.parse(result)
}

export const getUserByLogin = async (login) => {
    const users = await getAllUsers()
    return users.find(user => user.login === login)
}

export const getUserById = async (id) => {
    const users = await getAllUsers()
    return users.find(user => user.id === id)
}