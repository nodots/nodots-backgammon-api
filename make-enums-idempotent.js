const fs = require('fs')
const path = require('path')

const migrationsDir = path.join(__dirname, 'drizzle')

// Get all .sql files and sort to find the latest
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()

if (files.length === 0) {
  console.error('No migration files found.')
  process.exit(1)
}

const latestFile = files[files.length - 1]
const latestFilePath = path.join(migrationsDir, latestFile)
let sql = fs.readFileSync(latestFilePath, 'utf8')

// Regex to match standalone CREATE TYPE ... AS ENUM ...; (not already in a DO block)
// We'll split by lines and process line-by-line to avoid double-wrapping
const lines = sql.split('\n')
let newLines = []
let i = 0
while (i < lines.length) {
  const line = lines[i]
  // Only match lines that are not inside a DO block
  if (/^CREATE TYPE [^ ]+ AS ENUM\(.+\);/.test(line.trim())) {
    // Look back to see if we're inside a DO block
    let insideDoBlock = false
    for (let j = Math.max(0, newLines.length - 5); j < newLines.length; j++) {
      if (/DO \$\$/.test(newLines[j])) {
        insideDoBlock = true
        break
      }
    }
    if (!insideDoBlock) {
      // Extract type name and values
      const match = line.match(/^CREATE TYPE ([^ ]+) AS ENUM\((.+)\);/)
      if (match) {
        let typeName = match[1]
        const enumValues = match[2]
        const typeNameForCheck = typeName
          .replace(/^[^\.]+\./, '')
          .replace(/"/g, '')
        newLines.push(`DO $$`)
        newLines.push(`BEGIN`)
        newLines.push(
          `    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${typeNameForCheck}') THEN`
        )
        newLines.push(`        CREATE TYPE ${typeName} AS ENUM(${enumValues});`)
        newLines.push(`    END IF;`)
        newLines.push(`END$$;`)
        i++
        continue
      }
    }
  }
  newLines.push(line)
  i++
}

fs.writeFileSync(latestFilePath, newLines.join('\n'), 'utf8')
console.log(`Processed enums in: ${latestFile}`)
