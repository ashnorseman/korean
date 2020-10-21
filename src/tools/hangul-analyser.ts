/**
 * Analysis parts of hangul
 */

import { vowelMergePairs } from '../data/vowel-merge-pairs';

export class HangulAnalyser {
  private static leads = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ',
    'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ᄋ',
    'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ];

  private static vowels = [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
    'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
    'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
  ];

  private static tails = [
    'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ',
    'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
    'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ',
    'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  ];

  // e.g. Map<'ㅓ', Map<'ㅜ', 'ㅝ'>>
  // e.g. Map<'ㅏ', Map<'ㅗ', 'ㅘ'>>
  private static vowelMergePairs: Map<string, Map<string, string>> = new Map();

  /**
   * Add a lead to a vowel
   * @param vowel e.g. 'ㅏ'
   * @param lead  e.g. 'ㄱ'
   * @return      e.g. '가'
   */
  public addLead(vowel: string, lead: string): string {
    const leadIndex = HangulAnalyser.leads.indexOf(lead);
    const vowelIndex = HangulAnalyser.vowels.indexOf(vowel);

    if (leadIndex === -1 || vowelIndex === -1) {
      return vowel;
    }

    return String.fromCodePoint(44032 + 588 * leadIndex + 28 * vowelIndex);
  }

  /**
   * Add a tail to a character
   * @param char  e.g. '가'
   * @param tail  e.g. 'ㄴ'
   * @return      e.g. '간'
   */
  public addTail(char: string, tail: string): string {
    if (this.hasTail(char) || !char) {
      return char;
    }

    const tailIndex = HangulAnalyser.tails.indexOf(tail);

    if (tailIndex === -1) {
      return char;
    }

    const codePoint = char.codePointAt(0);

    if (!codePoint) {
      return '';
    }

    return String.fromCodePoint(codePoint + tailIndex + 1);
  }

  /**
   * If the character has a tail
   * e.g. '가' => false
   * e.g. '간' => true
   */
  public hasTail(char: string): boolean {
    return !!this.parseTail(char);
  }

  /**
   * If the character is a tail
   * e.g. 'ㄱ' => true
   * e.g. 'ㄴ' => false
   */
  public isTail(char: string): boolean {
    return HangulAnalyser.tails.indexOf(char) !== -1;
  }

  /**
   * Merge a vowel into a character
   * @param char - base character
   * @param vowel - the vowel to be merged into the character
   */
  public mergeVowel(char: string, vowel: string): string {
    if (char === '하' && vowel === 'ㅕ') {
      return '해';
    }

    if (this.hasTail(char)) {
      return char;
    }

    const baseVowel = this.parseVowel(char);

    if (!baseVowel) {
      return char;
    }

    if (baseVowel === vowel) {
      return char;
    }

    const mergedVowel = HangulAnalyser.vowelMergePairs.get(vowel)?.get(baseVowel);

    if (!mergedVowel) {
      return `${char}${this.addLead(vowel, 'ㅇ')}`;
    }

    const codePoint: number = char.codePointAt(0) as number;

    return String.fromCodePoint(
      codePoint
      - HangulAnalyser.vowels.indexOf(baseVowel) * 28
      + HangulAnalyser.vowels.indexOf(mergedVowel) * 28
    );
  }

  /**
   * Parse lead consonant
   * e.g. '가' => 'ㄱ'
   */
  public parseLead(char: string): string {
    if (!char) {
      return '';
    }

    const codePoint = char.codePointAt(0);

    if (!codePoint) {
      return '';
    }

    return HangulAnalyser.leads[Math.floor((codePoint - 44032) / 588)] || '';
  }

  /**
   * Parse tail consonant
   * e.g. '간' => 'ㄴ'
   */
  public parseTail(char: string): string {
    if (!char) {
      return '';
    }

    const codePoint = char.codePointAt(0);

    if (!codePoint) {
      return '';
    }

    return HangulAnalyser.tails[(codePoint - 44032) % 28 - 1] || '';
  }

  /**
   * Parse vowel
   * e.g. '가' => 'ㅏ'
   */
  public parseVowel(char: string): string {
    if (!char) {
      return '';
    }

    const codePoint = char.codePointAt(0);

    if (!codePoint) {
      return '';
    }

    const tail = this.parseTail(char);
    const tailIndex = tail ? HangulAnalyser.tails.indexOf(tail) || 0 : 0;

    return HangulAnalyser.vowels[Math.floor((codePoint - 44032 - tailIndex) % 588 / 28)] || '';
  }

  /**
   * Remove the tail consonant
   * e.g. '간' => '가'
   */
  public removeTail(char: string): string {
    if (!this.hasTail(char) || !char) {
      return char;
    }

    const tailIndex = HangulAnalyser.tails.indexOf(this.parseTail(char));
    const codePoint = char.codePointAt(0);

    if (!codePoint) {
      return '';
    }

    return String.fromCodePoint(codePoint - tailIndex - 1);
  }

  /**
   * Initialize vowels that can be merged
   */
  public static initVowelMergePairs() {
    vowelMergePairs.forEach(group => {
      let mergeMap = HangulAnalyser.vowelMergePairs.get(group[0]);

      if (!mergeMap) {
        mergeMap = new Map();
        HangulAnalyser.vowelMergePairs.set(group[0], mergeMap);
      }

      mergeMap.set(group[1], group[2]);
    });
  }
}

HangulAnalyser.initVowelMergePairs();
