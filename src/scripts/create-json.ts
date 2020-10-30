import * as fs from 'fs';
import * as path from 'path';

import { RawWordItem } from '../models';

const wordsPath = path.resolve(__dirname, '../raw-data/words.txt');
const wordList: RawWordItem[] = fs.readFileSync(wordsPath, 'utf-8')
  .trim()
  .split('\n')
  .map(line => RawWordItem.fromLine(line))
  .sort((a, b) => a.compare(b));

fs.writeFileSync(wordsPath, wordList.map(word => word.toLine()).join('\n') + '\n');

const words: RawWordItem[] = wordList.filter(line => line.used);

fs.writeFileSync(path.resolve(__dirname, '../data/vocabulary.json'), JSON.stringify(words));
