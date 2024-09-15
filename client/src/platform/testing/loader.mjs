import { register } from "node:module";
import * as url from "node:url";
import * as path from "node:path";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const target = path.join(__dirname, 'loader-raw.mjs')
register(url.pathToFileURL(target));
