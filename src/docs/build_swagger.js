import { readFileSync } from 'node:fs';
import yaml from 'yaml';
const doc = readFileSync('./src/docs/openapi.yaml','utf8');
const parsed = yaml.parse(doc);
console.log(JSON.stringify(parsed,null,2));
