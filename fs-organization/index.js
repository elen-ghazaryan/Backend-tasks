import fs from 'fs/promises'

const extensions = ['txt', 'jpg', 'mp3', 'mp4', 'pdf', 'jsx', 'html', 'png', 'css', 'json']
let command = process.argv[2]

if(command === 'create') {
    await createDirectory("test")
    for(let i = 1; i <= 150; ++i) {
        await fs.writeFile("test/" + i + "." + extensions[randomNum()], "")
    }
    console.log("150 test files created.");

} else if(command === 'organize') {
    await createDirectory("result")
    
    const files = await fs.readdir("test")
    for(let file of files) {
        const ext = file.split('.').pop()
        const destFolder = `result/${ext}`
        await fs.mkdir(destFolder, {recursive: true})
        await fs.rename(`test/${file}`, `${destFolder}/${file}`)
    }

    console.log('Files organized by extension!');
}


async function createDirectory(name) {
  try {
    await fs.mkdir(name, {recursive: true});
    console.log(`${name} directory is ready.`);
  } catch (err) {
    console.error(`Error creating directory ${name}:`, err);
  }
}

function randomNum() {
    return Math.floor(Math.random() * extensions.length)
}