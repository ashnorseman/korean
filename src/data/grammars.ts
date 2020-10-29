import { GrammarItem } from '../models';

export const grammarItems: GrammarItem[] = ([
  {
    name: '습니다/ㅂ니다',
    formAfterConsonant: '습니다.',
    formAfterVowel: 'ㅂ니다.',
    usedAfterAdjective: true,
    usedAfterNoun: false,
    usedAfterVerb: true,
    previousForm: '-',
    irregularRule: [['ㄹ', '']],
    description: '敬语格式体终结句尾',
    ysBook: 1,
    ysUnit: 1
  },
  {
    name: '습니까/ㅂ니다까',
    formAfterConsonant: '습니까?',
    formAfterVowel: 'ㅂ니까?',
    usedAfterAdjective: true,
    usedAfterNoun: false,
    usedAfterVerb: true,
    previousForm: '-',
    irregularRule: [['ㄹ', '']],
    description: '습니다/ㅂ니다 的疑问句型',
    ysBook: 1,
    ysUnit: 1
  },
  {
    name: '은/는',
    formAfterConsonant: '은',
    formAfterVowel: '는',
    usedAfterAdjective: false,
    usedAfterNoun: true,
    usedAfterVerb: false,
    description: '主语助词；重点在前面；提示主题，可做句子的大主语',
    ysBook: 1,
    ysUnit: 1
  },
  {
    name: '이/가',
    formAfterConsonant: '이',
    formAfterVowel: '가',
    usedAfterAdjective: false,
    usedAfterNoun: true,
    usedAfterVerb: false,
    irregularForm: [['저', '제가']],
    description: '主语助词；重点在后面；可做句子的小主语',
    ysBook: 1,
    ysUnit: 1
  },
  {
    name: '입니다',
    formAfterConsonant: '입니다.',
    formAfterVowel: '입니다.',
    usedAfterAdjective: false,
    usedAfterNoun: true,
    usedAfterVerb: false,
    description: '敬语格式体终结语尾，相当于中文中的 “是…”',
    ysBook: 1,
    ysUnit: 1
  },
  {
    name: '입니까',
    formAfterConsonant: '입니까?',
    formAfterVowel: '입니까?',
    usedAfterAdjective: false,
    usedAfterNoun: true,
    usedAfterVerb: false,
    description: '입니다 的疑问句型',
    ysBook: 1,
    ysUnit: 1
  },
  {
    name: '아닙니다',
    formAfterConsonant: '아닙니다.',
    formAfterVowel: '아닙니다.',
    prefix: '이/가',
    usedAfterAdjective: false,
    usedAfterNoun: true,
    usedAfterVerb: false,
    description: '敬语格式体终结语尾，相当于中文中的 “不是…”',
    ysBook: 1,
    ysUnit: 1
  },
  {
    name: '도',
    formAfterConsonant: '도',
    formAfterVowel: '도',
    usedAfterAdjective: false,
    usedAfterNoun: true,
    usedAfterVerb: false,
    description: '表示列举相同或相似的事物',
    ysBook: 1,
    ysUnit: 2
  },
  {
    name: '에',
    formAfterConsonant: '에',
    formAfterVowel: '에',
    usedAfterAdjective: false,
    usedAfterNoun: true,
    usedAfterVerb: false,
    usedForWordTags: 'place',
    description: '表示主体的存在处所',
    ysBook: 1,
    ysUnit: 2
  },
  {
    name: '하고',
    formAfterConsonant: '하고',
    formAfterVowel: '하고',
    usedAfterAdjective: false,
    usedAfterNoun: true,
    usedAfterVerb: false,
    description: '连接两个或两个以上的体词',
    ysBook: 1,
    ysUnit: 2
  },
  {
    name: '있다/계시다',
    formAfterConsonant: '있습니다.',
    formAfterVowel: '있습니다.',
    prefix: '이/가',
    usedAfterAdjective: false,
    usedAfterNoun: true,
    usedAfterVerb: false,
    usedForWordTags: 'entity',
    description: '有、在',
    ysBook: 1,
    ysUnit: 2
  },
  {
    name: '없다',
    formAfterConsonant: '없습니다.',
    formAfterVowel: '없습니다.',
    prefix: '은/는',
    usedAfterAdjective: false,
    usedAfterNoun: true,
    usedAfterVerb: false,
    usedForWordTags: 'entity',
    description: '没有、不在',
    ysBook: 1,
    ysUnit: 2
  }
] as any[]);
