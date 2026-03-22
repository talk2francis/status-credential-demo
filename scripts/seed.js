import { promises as fs } from 'fs'
import path from 'path'

async function main() {
  const seedPath = path.resolve('demo-data/seed.json')
  const buffer = await fs.readFile(seedPath, 'utf-8')
  const payload = JSON.parse(buffer)
  const outputDir = path.resolve('.openclaw-cache')
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(path.join(outputDir, 'seed-preview.json'), JSON.stringify(payload, null, 2))
  console.log('Seed data validated and cached in .openclaw-cache/seed-preview.json')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
