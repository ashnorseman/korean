import * as fs from 'fs';
import * as path from 'path';

import { IWord } from '../interfaces/i-word';
import { NaverDictResponse } from '../interfaces/naver-dict-response';
import { NaverEntryResponse } from '../interfaces/naver-entry-response';

const Aromanize = require("aromanize");

const bent = require('bent')
const getJSON = bent('json');
const getBuffer = bent('buffer');

// 'Word', 'Meaning', 'POS', 'Hanja', 'Category', 'English'
const newFile = '../raw-data/yeon-sei-vocabulary.txt';
const wordList: string[][] = fs.readFileSync(path.resolve(__dirname, newFile), 'utf-8')
  .split('\n')
  .map(line => line.split('\t'));

const wordFilePath = path.resolve(__dirname, '../raw-data/words.txt');
const wordFileContent = fs.readFileSync(wordFilePath, 'utf-8').trim();
const savedWordList: Set<string> = new Set(wordFileContent
  .split('\n')
  .map(line => line.split('\t')[3])
  .filter(item => !!item)
);

const naverResults: IWord[] = [];

async function parseWords() {
  const promises = wordList.map(async line => {
    const wordName = line[0];
    const ysBook = +line[1];
    const ysUnit = +line[2];

    if (!wordName || savedWordList.has(wordName)) {
      return;
    }

    const result: NaverDictResponse = await getJSON(`https://zh.dict.naver.com/api3/zhko/search?query=${wordName}`).catch((error: any) => console.log(error));

    const entryPromises = result.searchResultMap?.searchResultListMap?.WORD?.items?.map(async item => {
      if (item.handleEntry !== wordName) {
        return;
      }

      const entry: NaverEntryResponse = await getJSON(`https://zh.dict.naver.com/api/platform/zhko/entry.nhn?entryId=${item.entryId}`);
      const entryCommon = entry?.entry?.group?.entryCommon;
      const pronunciation = entryCommon?.korean_pron && (entryCommon?.korean_pron !== wordName)
        ? `[${entryCommon?.korean_pron}]`
        : '';
      const filePath = entryCommon?.pron_file_female || entryCommon?.pron_file_male;

      if (filePath) {
        getBuffer(filePath).then((res: any) => {
          fs.writeFileSync(path.resolve(__dirname, `../../public/audio/${Aromanize.romanize(wordName)}.mp3`), res);
        });
      }

      item.meansCollector?.forEach(means => {
        let pos = means.partOfSpeech2 || '未知';

        if (pos && pos.includes('动词')) {
          pos = '动词';
        }

        const firstMeaning = means.means[0];

        if (!firstMeaning) {
          return;
        }

        const meaning = firstMeaning.value
            .replace(/<[^>]+>/g, '')
            .replace(/\([^)]+\)/g, '')
            .replace(/\s*([，。])\s*/g, '$1')
            .replace(/\s*,\s*/g, '，')
            .replace(/。$/, '');

        if (!meaning) {
          return;
        }

        naverResults.push({
          description: item.expAliasGeneralAlwaysList?.pop()?.originLanguageValue || '',
          example: (firstMeaning.exampleTrans || '').replace(/<[^>]+>/g, ''),
          exampleTrans: (firstMeaning.exampleOri || '').replace(/<[^>]+>/g, '') || '',
          hasAudio: !!filePath,
          meaning,
          pos,
          pronunciation,
          wordName,
          ysBook,
          ysUnit
        });
      });
    });

    await Promise.all(entryPromises);
  });

  await Promise.all(promises).catch(error => console.log(error));

  const fileLines: string[] = [];

  naverResults.sort((a, b) => {
    return ((a.ysBook || 0) - (b.ysBook || 0)) ||
      ((a.ysUnit || 0) - (b.ysUnit || 0)) ||
      a.pos?.localeCompare(b.pos) ||
      a.wordName.localeCompare(b.wordName);
  }).forEach(word => {
    fileLines.push(`\t${word.ysBook}\t${word.ysUnit}\t${word.wordName}\t${word.pronunciation}\t${word.hasAudio}\t${word.pos}\t${word.meaning}\t${word.description}\t\t${word.example}\t${word.exampleTrans}`);
  });

  fs.writeFileSync(wordFilePath, wordFileContent + '\n' + fileLines.join('\n'), 'utf-8');
}

parseWords().then();
