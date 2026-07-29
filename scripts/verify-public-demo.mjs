import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outputDirectory = join(process.cwd(), 'dist-public-demo');
const entryFile = join(outputDirectory, 'index.html');

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(filePath) : [filePath];
  });
}

function fail(message) {
  console.error(`Public demo verification failed: ${message}`);
  process.exitCode = 1;
}

if (!existsSync(entryFile) || !statSync(entryFile).isFile()) {
  fail('missing dist-public-demo/index.html');
} else if (!existsSync(join(outputDirectory, '.nojekyll'))) {
  fail('missing .nojekyll in the Pages artifact');
} else {
  const textFiles = listFiles(outputDirectory).filter((filePath) => /\.(?:html|js|css)$/i.test(filePath));
  const contents = textFiles.map((filePath) => readFileSync(filePath, 'utf8')).join('\n');
  const expected = [
    'Публичное read-only демо',
    "connect-src 'none'",
    'Только вымышленные сценарии',
  ];
  const forbidden = [
    '/api/dialogue/analyze',
    'http://localhost:8787',
    'OPENAI_API_KEY',
  ];

  for (const text of expected) {
    if (!contents.includes(text)) fail(`expected marker is absent: ${text}`);
  }
  for (const text of forbidden) {
    if (contents.includes(text)) fail(`forbidden server marker is present: ${text}`);
  }
  if (!process.exitCode) {
    console.log(`Public demo artifact verified: ${textFiles.length} text assets, no API client.`);
  }
}
