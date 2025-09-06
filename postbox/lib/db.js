import { readFile, writeFile } from "fs/promises"
const PATH = "./lib/posts.json"

export const readAll = async () => {
    const posts = await readFile(PATH, "utf-8")
    if(!posts) return [];

    return JSON.parse(posts)
}

export const save = async (post) => {
    const posts = await readAll()
    posts.push(post)

    await writeFile(PATH, JSON.stringify(posts))
}

