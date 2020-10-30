import { ExecException } from 'child_process';
import { Stream } from 'stream';

const childProcess = require('child_process');
const prompts = require('prompts');

(async () => {
  const questions = [
    {
      message: 'What do you want to do?',
      name: 'scriptName',
      type: 'select',
      choices: [
        {
          title: 'Query vocabulary from Naver',
          value: 'query-vocabulary'
        },
        {
          title: 'Create JSON files',
          value: 'create-json'
        }
      ]
    },
    {
      message: 'Which book are you using?',
      name: 'bookIndex',
      type: 'number',
      min: 1,
      max: 6
    }
  ];

  const response: {
    bookIndex: number,
    scriptName: string
  } = await prompts(questions);

  const scriptPath = `src/scripts/${response.scriptName}.ts`;
  const bookIndex = response.bookIndex;
  const script = `ts-node-dev --respawn --project src/scripts/tsconfig.json ${scriptPath} -- --book ${bookIndex}`;

  const spawn = childProcess.exec(script);

  spawn.stdout.on('data', (data: Buffer) => {
    console.log(data.toString());
  });
})();
