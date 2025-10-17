import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const [moduleName] = process.argv.slice(2)

if (!moduleName) {
  console.log('name required')
  process.exit(1)
}

const baseDir = path.join(process.cwd(), 'src', 'features', moduleName)
const directories = ['api', 'views', 'components', 'composables', 'stores', 'constants']

directories.forEach(directoryName => {
  fs.mkdirSync(path.join(baseDir, directoryName), { recursive: true })
})

console.log('created', moduleName)
