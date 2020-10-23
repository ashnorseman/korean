import * as fs from 'fs';
import * as path from 'path';

const shengmuList = /^(b|p|m|f|d|t|n|l|g|k|h|j|q|x|zh|ch|sh|r|z|c|s|y|w)/;
const yunmuMap: any = {
  'ā': 'a',
  'á': 'a',
  'ǎ': 'a',
  'à': 'a',
  'ō': 'o',
  'ó': 'o',
  'ǒ': 'o',
  'ò': 'o',
  'ē': 'e',
  'é': 'e',
  'ě': 'e',
  'è': 'e',
  'ī': 'i',
  'í': 'i',
  'ǐ': 'i',
  'ì': 'i',
  'ū': 'u',
  'ú': 'u',
  'ǔ': 'u',
  'ù': 'u',
  'ǖ': 'v',
  'ǘ': 'v',
  'ǚ': 'v',
  'ǜ': 'v'
}
const shengmuSet: Map<string, Map<string, string>> = new Map();
const yunmuSet: Map<string, Set<string>> = new Map();

const hanja = path.resolve(__dirname, '../raw-data/hanja.txt');
const hanjaLines: any[] = fs.readFileSync(hanja, 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split('\t'))
  .map(line => {
    const hanja = line[0];
    const pinyin = line[9];
    const shengmu = pinyin.match(shengmuList)
      ? (pinyin.match(shengmuList)?.[1] || '')
      : '';
    const yunmu = pinyin.slice(shengmu?.length);
    const yunmuSimplified = yunmu.replace(/[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/, char => {
      return yunmuMap[char] as string;
    })
    const korean = line[4];
    const koreanLead = line[6];
    const koreanVowel = line[8];

    if (!shengmuSet.get(shengmu)) {
      shengmuSet.set(shengmu, new Map());
    }

    if (!shengmuSet.get(shengmu)?.get(koreanLead)) {
      shengmuSet.get(shengmu)?.set(koreanLead, '');
    }

    shengmuSet.get(shengmu)?.set(
      koreanLead,
      shengmuSet.get(shengmu)?.get(koreanLead) + `${hanja}[${korean}]`
    );

    if (!yunmuSet.get(yunmuSimplified)) {
      yunmuSet.set(yunmuSimplified, new Set<string>());
    }

    yunmuSet.get(yunmuSimplified)?.add(koreanVowel);

    return {
      hanja,
      pinyin,
      shengmu,
      yunmu,
      yunmuSimplified,
      korean,
      koreanLead,
      koreanVowel
    };
  });

const koreanSet: Map<string, string[]> = new Map();

hanjaLines.forEach(hanja => {
  if (!koreanSet.get(hanja.korean)) {
    koreanSet.set(hanja.korean, []);
  }

  koreanSet.get(hanja.korean)?.push(hanja.hanja);
});

console.log(koreanSet);

// fs.writeFileSync(wordsPath, wordLines.join('\n') + '\n');
//
// const words: IWord[] = wordLines
//   .filter(line => line.startsWith('*'))
//   .map(line => line.split(/\t/))
//   .map(line => {
//     return {
//       description: line[8],
//       example: line[9],
//       exampleTrans: line[10],
//       hasAudio: line[5] === 'true',
//       meaning: line[7],
//       pos: line[6] as POS,
//       pronunciation: line[4],
//       wordName: line[3],
//       ysBook: +line[1],
//       ysUnit: +line[2]
//     };
//   })
//   .sort((a, b) => {
//     if (a.ysBook !== b.ysBook) {
//       return a.ysBook - b.ysBook;
//     }
//
//     if (a.ysUnit !== b.ysUnit) {
//       return a.ysUnit - b.ysUnit;
//     }
//
//     const posSequence: string[] = ['名词', '动词', '形容词', '副词', '代名词', '冠词', '助词', '感叹词'];
//     const aPos = posSequence.indexOf(a.pos);
//     const bPos = posSequence.indexOf(b.pos);
//
//     if (aPos !== bPos) {
//       return aPos - bPos;
//     }
//
//     return a.wordName.localeCompare(b.wordName);
//   });
//
// fs.writeFileSync(path.resolve(__dirname, '../data/vocabulary.json'), JSON.stringify(words));
