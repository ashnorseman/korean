/**
 * Grammar items
 */

import { IWord } from '../interfaces/i-word';
import { HangulAnalyser } from '../tools/hangul-analyser';
import { grammarItems } from '../data/grammars';

const hangulAnalyser = new HangulAnalyser();

export class GrammarItem {
  // details
  public description: string = '';

  // the name if grammar
  public name: string = '';

  // the grammar forms
  public formAfterConsonant: string = ''
  public formAfterVowel: string = ''

  // the grammar is used after:
  public usedAfterAdjective: boolean = false;
  public usedAfterNoun: boolean = false;
  public usedAfterVerb: boolean = false;
  public usedForWordTags: string = '';

  // the prefix grammar to be used before this grammar
  // if prefix grammar is set, `formAfterConsonant` and `formAfterVowel` are the same
  public prefix: string = '';

  // When added after an adjective or a verb
  // the previous verb should be of the form:
  // -: the base form
  // eo: the 아/어/여 form
  // eu: the 으 form
  public previousForm?: '-' | 'eo' | 'eu' = '-';

  // the irregular forms for nouns
  // e.g. ['저', '제'] means whole replacement
  public irregularForm?: string[][] = [];

  // the irregular forms of verbs and adjectives
  // e.g. ['ㄹ', ''] means words ending with 'ㄹ' should be removed
  public irregularRule?: string[][] = [];

  public exampleSuffix?: string = '';

  // appeared in which lesson
  public ysBook?: number;
  public ysUnit?: number;

  constructor(data: Partial<GrammarItem>) {
    Object.assign(this, data);
  }

  /**
   * Add grammar item after the word
   */
  public provideExampleWith(word: IWord): string {
    switch (word.pos) {
    case '名词':
    case '代名词':
      return this.usedAfterNoun ? this.provideExampleWithNoun(word) : '';
    case '动词':
      return this.usedAfterVerb ? this.provideExampleWithAV(word) : '';
    case '形容词':
      return this.usedAfterAdjective ? this.provideExampleWithAV(word) : '';
    }

    return '';
  }

  /**
   * The grammar can be used with the word
   */
  public suitableFor(word: IWord): boolean {
    if (this.usedForWordTags && (!word.tags || !word.tags.includes(this.usedForWordTags))) {
      return false;
    }

    switch (word.pos) {
    case '名词':
    case '代名词':
      return this.usedAfterNoun;
    case '动词':
      return this.usedAfterAdjective;
    case '形容词':
      return this.usedAfterVerb;
    }

    return false;
  }

  private addPrefix(word: IWord): string {
    if (!this.prefix) {
      return '';
    }

    const grammar = grammarItems.find(g => g.name === this.prefix);

    return grammar?.provideExampleWith(word) || '';
  }

  private provideExampleWithNoun(word: IWord): string {
    const prefixAdded = this.addPrefix(word);

    if (prefixAdded) {
      return `${prefixAdded} ${this.formAfterVowel}`;
    }

    const irregular = this.irregularForm?.find(form => form[0] === word.wordName);

    if (irregular) {
      return irregular[1];
    }

    const tail = hangulAnalyser.parseTail(word.wordName[word.wordName.length - 1]);
    let result = '';

    if (tail) {
      if (tail === 'ㄹ' && this.formAfterVowel === '로') {
        result = `${word.wordName}로`;
      }

      result = `${word.wordName}${this.formAfterConsonant}`;
    } else {
      result = `${word.wordName}${this.formAfterVowel}`;
    }

    return this.exampleSuffix ? `${result} ${this.exampleSuffix}` : result;
  }

  private provideExampleWithAV(word: IWord): string {
    let wordBase = word.wordName.slice(0, -1);
    const wordBaseLastChar = wordBase[wordBase.length - 1];
    const wordTail = hangulAnalyser.parseTail(wordBaseLastChar);

    const irregular = this.irregularRule?.find(rule => rule[0] === wordTail);

    if (irregular) {
      wordBase = wordBase.slice(0, -1) + hangulAnalyser.addTail(hangulAnalyser.removeTail(wordBaseLastChar), irregular[1]);
    }

    const hasTail = hangulAnalyser.hasTail(wordBase[wordBase.length - 1]);

    if (hasTail) {
      return `${wordBase}${this.formAfterConsonant}`;
    }

    if (hangulAnalyser.isTail(this.formAfterVowel[0])) {
      wordBase = wordBase.slice(0, -1)
        + hangulAnalyser.addTail(wordBase[wordBase.length - 1], this.formAfterVowel[0]);

      return `${wordBase}${this.formAfterVowel.slice(1)}`;
    }

    return `${wordBase}${this.formAfterVowel}`;
  }
}
