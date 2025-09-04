import { readFile, writeFile } from "fs/promises"
const PATH = "./lib/data.json"

export const readAll = async () => {
    const users = await readFile(PATH, "utf-8")
    if(!users.trim()) return []
    return JSON.parse(users)
}

export const save = async (user) => {
    const users = await readAll(PATH)
    users.push(user)

    await writeFile(PATH, JSON.stringify(users), "utf-8")
}

export const deleteUser = async (id) => {
    const users = await readAll();

    const filtered = users.filter(user => user.id != id)
    await writeFile(PATH, JSON.stringify(filtered), "utf-8")
}

export const findUser = async (id) => {
    const users = await readAll()
    const user = users.find(user => user.id == id)
    return user;
}

export const editUser = async (editedUser, id) => {
    const users = await readAll()
    const newUsers = users.map(user => {
        return ( 
            user.id == id ? {name: editedUser.name, surname: editedUser.surname, id}
            : user  
        )  
    })

    await writeFile(PATH, JSON.stringify(newUsers), "utf-8")

} 