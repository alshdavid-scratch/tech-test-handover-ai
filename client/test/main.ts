import * as reporter from 'node:test/reporters'
import { run } from 'node:test'
import * as path from 'node:path'
import * as url from 'node:url'
import { finished } from 'node:stream'
import { globSync } from 'glob'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

void (async function () {
  const files = globSync('./src/**/*.test.{ts,tsx}', { cwd: path.dirname(__dirname) })

  const test_stream = run({
    files,
    concurrency: true,
  })
    .on('test:fail', () => {
      process.exitCode = 1
    })
    .compose(new reporter.spec())

  test_stream.pipe(process.stdout)
  await new Promise((res) => finished(test_stream, res))
})()