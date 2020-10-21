import * as fs from 'fs';
import * as path from 'path';

import { IWord } from '../interfaces/i-word';

const wordsPath = path.resolve(__dirname, '../raw-data/words.txt');
const wordLines: string[] = fs.readFileSync(wordsPath, 'utf-8')
  .trim()
  .split('\n')
  .sort((a, b) => {
    return a.startsWith('*')
      ? b.startsWith('*') ? 0 : -1
      : b.startsWith('*') ? 1 : 0;
  });

fs.writeFileSync(wordsPath, wordLines.join('\n') + '\n');

const words: IWord[] = wordLines
  .filter(line => line.startsWith('*'))
  .map(line => line.split(/\t/))
  .map(line => {
    return {
      description: line[8],
      tags: (line[9] || '').split(','),
      example: line[10],
      exampleTrans: line[11],
      hasAudio: line[5] === 'true',
      meaning: line[7],
      pos: line[6],
      pronunciation: line[4],
      wordName: line[3],
      ysBook: +line[1],
      ysUnit: +line[2]
    };
  })
  .sort((a, b) => {
    if (a.ysBook !== b.ysBook) {
      return a.ysBook - b.ysBook;
    }

    if (a.ysUnit !== b.ysUnit) {
      return a.ysUnit - b.ysUnit;
    }

    const posSequence: string[] = ['名词', '动词', '形容词', '副词', '代名词', '依赖名词', '冠词', '助词', '感叹词'];
    const aPos = posSequence.indexOf(a.pos);
    const bPos = posSequence.indexOf(b.pos);

    if (aPos !== bPos) {
      return aPos - bPos;
    }

    return a.wordName.localeCompare(b.wordName);
  });

fs.writeFileSync(path.resolve(__dirname, '../data/vocabulary.json'), JSON.stringify(words));
