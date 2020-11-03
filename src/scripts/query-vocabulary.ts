import * as fs from 'fs';
import * as path from 'path';

import { NaverDictResponse } from '../interfaces/naver-dict-response';
import { NaverEntryResponse } from '../interfaces/naver-entry-response';
import { RawWordItem } from '../models';

const Aromanize = require('aromanize');
const bent = require('bent');
const yargs = require('yargs');

const getJSON = bent('json');
const getBuffer = bent('buffer');

class QueryVocabulary {
  constructor(private bookIndex: number) {}

  /**
   * Clean markers in the string
   */
  public cleanText(text: string): string {
    return text
      .replace(/<[^<>]+>/g, '')
      .replace(/\[[^[\]]+\]/g, '')
      .replace(/\([^()]+\)/g, '')
      .replace(/\([^()]+\)/g, '')
      .replace(/&lt;.+&gt;/g, '')
      .replace(/[()].+$/g, '');
  }

  /**
   * Query vocabulary from Naver
   */
  public async fetchVocabulary(): Promise<RawWordItem[]> {
    const rawWordList: RawWordItem[] = this.parseRawWordList();
    const filePath = `../raw-data/words-${this.bookIndex}.txt`;
    const savedWordList: RawWordItem[] = fs
      .readFileSync(path.resolve(__dirname, filePath), 'utf-8')
      .trim()
      .split('\n')
      .filter(line => !!line)
      .map(line => RawWordItem.fromLine(line))
      .sort((a, b) => a.compare(b));
    const newFoundResult: RawWordItem[] = [];

    const wordPromises = rawWordList
      .filter(word => !savedWordList.find(w => w.wordName === word.wordName))
      .map(async word => {
        const result: NaverDictResponse = await getJSON(`https://zh.dict.naver.com/api3/zhko/search?query=${word.wordName}`)
          .catch(() => console.log(`Can't query word: ${word.wordName}`));
        const findItems = result.searchResultMap?.searchResultListMap?.WORD?.items;
        const matchItems = findItems?.filter(item => {
          return item.handleEntry === word.wordName
            && item.meansCollector?.some(meaning => meaning?.means?.length);
        });

        if (!matchItems?.length) {
          console.log(`Can't find exact match for ${word.wordName}. Possible options: [${findItems?.map(item => item.handleEntry).join(', ')}]`);
          return;
        }

        const entryPromises = matchItems.map(async item => {
          const entry: NaverEntryResponse = await getJSON(`https://zh.dict.naver.com/api/platform/zhko/entry.nhn?entryId=${item.entryId}`);
          const entryCommon = entry?.entry?.group?.entryCommon;
          const pronunciation = entryCommon?.korean_pron && (entryCommon?.korean_pron !== word.wordName)
            ? `[${entryCommon?.korean_pron}]`
            : '';
          const filePath = entryCommon?.pron_file_female || entryCommon?.pron_file_male;
          const savedFilePath = path.resolve(__dirname, `../../public/audio/${Aromanize.romanize(word.wordName)}.mp3`);

          if (filePath) {
            getBuffer(filePath).then((res: any) => {
              fs.writeFileSync(savedFilePath, res);
            });
          }

          item.meansCollector?.forEach(meaning => {
            let pos = meaning.partOfSpeech2 || '未知';

            if (pos.includes('动词')) {
              pos = '动词';
            }

            const meanings = this.mergeMeanings(
              meaning.means.map(mean => this.cleanText(mean.value))
            );

            if (!meanings) {
              console.log(`No meanings for word ${word.wordName}`);
              return;
            }

            newFoundResult.push(new RawWordItem({
              description: item.expAliasGeneralAlwaysList?.pop()?.originLanguageValue || '',
              hasAudio: !!filePath,
              meaning: meanings,
              pos,
              pronunciation,
              wordName: word.wordName,
              ysBook: this.bookIndex,
              ysUnit: word.ysUnit
            }));
          });
        });

        await Promise.all(entryPromises).catch(error => console.error(error));
      });

    await Promise.all(wordPromises).catch(error => console.error(error));

    return new Promise(resolve => resolve(newFoundResult));
  }

  /**
   * Merge all meanings into one string
   */
  public mergeMeanings(meanings: string[]): string {
    const result: Set<string> = new Set<string>();

    meanings.forEach(meaning => {
      meaning
        .split(/\s*[,，。]\s*/)
        .filter(item => !!item)
        .forEach(item => result.add(item));
    });

    return Array.from(result).join('，');
  }

  /**
   * Create vocabulary list from raw word list
   */
  public parseRawWordList(): RawWordItem[] {
    const filePath = `../raw-data/yeon-sei-vocabulary-${this.bookIndex}.txt`;

    return fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8')
      .trim()
      .split('\n')
      .filter(line => !!line)
      .map(line => {
        const split: string[] = line.split('\t');
        const wordName = split[0];

        if (!wordName) {
          throw new Error(`No word input!`);
        }

        return new RawWordItem({
          wordName,
          ysBook: this.bookIndex,
          ysUnit: +split[1] || 0
        });
      })
      .sort((a, b) => a.compare(b));
  }

  /**
   * Query and save data to words text
   */
  public queryAndSave() {
    this.fetchVocabulary().then(result => {
      const savePath = path.resolve(__dirname, `../raw-data/words-${this.bookIndex}.txt`);
      const currentContent = fs
        .readFileSync(savePath, 'utf-8')
        .trimEnd()
        .split('\n')
        .filter(line => !!line)
        .map(line => RawWordItem.fromLine(line));
      const wholeContent = [...currentContent, ...result]
        .filter(item => !!item.wordName)
        .sort((a, b) => a.compare(b, {
          wordNameBeforePos: true
        }));

      wholeContent.forEach((item, index) => {
        const sameName = wholeContent.filter(i => i.wordName === item.wordName);

        if (sameName.length === 1) {
          item.used = true;
          return;
        }
      });

      const text = wholeContent
        .sort((a, b) => a.compare(b, {
          wordNameBeforePos: true
        }))
        .map(item => item.toLine())
        .join('\n');

      fs.writeFileSync(savePath, text, 'utf-8');
    });
  }
}

const bookIndex = yargs.argv.book;
const instance = new QueryVocabulary(bookIndex);

instance.queryAndSave();
