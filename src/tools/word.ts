/**
 * Analysis words
 */

import { HangulAnalyser } from './hangul-analyser';
import { postPositionsAfterNouns } from '../data/post-positions-after-nouns';
import { postPositionsAfterConjugations } from '../data/post-positions-after-conjugations';

const hangulAnalyser = new HangulAnalyser();

export class Word {
  // Map<'는', '은'>
  private static postPositions: Map<string, string> = new Map();

  // Map<'아', Word.toFamiliarPolite>
  private static specialConjugationPostPositions: Map<string, () => string> = new Map();

  constructor(private wordName: string) {
    if (!wordName || !wordName.length) {
      throw new Error(`Invalid word ${wordName}`);
    }
  }

  /**
   * Add the post position to a word
   */
  public addPostPosition(postPosition: string): string {
    if (!postPosition) {
      return this.wordName;
    }

    const isConjugation = postPositionsAfterConjugations.some(pair => {
      return pair[0] === postPosition || pair[1] === postPosition;
    }) || Word.specialConjugationPostPositions.has(postPosition);

    if (isConjugation) {
      return this.addPostPositionToConjugation(postPosition);
    } else {
      return this.addPostPositionToNoun(postPosition);
    }
  }

  /**
   * Add the post position to a conjugation
   */
  private addPostPositionToConjugation(postPosition: string): string {
    let wordBase = this.wordName.slice(0, -1);

    if (!wordBase.length) {
      return this.wordName;
    }

    const specialTransform = Word.specialConjugationPostPositions.get(postPosition);

    if (specialTransform) {
      return specialTransform.call(this);
    }

    let postfixWithTail: string = postPosition;
    let postfixWithoutTail: string = postPosition;

    for (const [withoutTail, withTail] of Word.postPositions.entries()) {
      if (withTail === postPosition) {
        postfixWithoutTail = withoutTail;
      } else if (withoutTail === postPosition) {
        postfixWithTail = withTail;
      }
    }

    const fixedWordBase = wordBase.slice(0, -1);
    const wordBaseLastChar = wordBase[wordBase.length - 1];

    let postfix: string;

    if (hangulAnalyser.hasTail(wordBaseLastChar)) {
      if (
        hangulAnalyser.parseTail(wordBaseLastChar) === 'ㄹ'
        && (hangulAnalyser.isTail(postfixWithoutTail[0]) || postfixWithTail[0] === '으')
      ) {
        wordBase = fixedWordBase + hangulAnalyser.removeTail(wordBaseLastChar);
        postfix = postfixWithoutTail;
      } else {
        postfix = Word.postPositions.get(postPosition) || postPosition;
      }
    } else {
      postfix = postfixWithoutTail;
    }

    if (hangulAnalyser.isTail(postfix[0])) {
      wordBase = fixedWordBase
        + hangulAnalyser.addTail(wordBase[wordBase.length - 1], postfix[0]);

      postfix = postfix.slice(1);
    }

    return `${wordBase}${postfix}`;
  }

  /**
   * Add the post position to a noun
   */
  private addPostPositionToNoun(postPosition: string): string {
    let postfix: string = postPosition;

    const tail = hangulAnalyser.parseTail(this.wordName[this.wordName.length - 1]);

    if (tail) {
      if (tail === 'ㄹ' && (postPosition === '로' || postPosition === '으로')) {
        return `${this.wordName}로`;
      }

      postfix = Word.postPositions.get(postPosition) || postPosition;
    } else {
      for (const [withoutTail, withTail] of Word.postPositions.entries()) {
        if (withTail === postPosition) {
          postfix = withoutTail;
          break;
        }
      }
    }

    return `${this.wordName}${postfix}`;
  }

  /**
   * Transform the word to familiar polite style (아/어/여)
   */
  private toFamiliarPolite(): string {
    const wordBase = this.wordName.slice(0, -1);
    const wordBaseLastChar = wordBase[wordBase.length - 1];
    const lastVowel = hangulAnalyser.parseVowel(wordBaseLastChar);
    const appendix = wordBaseLastChar === '하'
      ? 'ㅕ'
      : lastVowel === 'ㅏ' || lastVowel === 'ㅗ'
        ? 'ㅏ'
        : 'ㅓ';

    if (hangulAnalyser.hasTail(wordBaseLastChar)) {
      return wordBase + hangulAnalyser.addLead(appendix, 'ᄋ');
    }

    return wordBase.slice(0, -1) + hangulAnalyser.mergeVowel(wordBaseLastChar, appendix);
  }

  /**
   * Initialize the post position pairs
   */
  public static initPostPositions() {
    [...postPositionsAfterNouns, ...postPositionsAfterConjugations].forEach(pair => {
      Word.postPositions.set(pair[0], pair[1]);
    });
  }

  /**
   * Initialize the special post position pairs
   */
  public static initSpecialPostPositions() {
    Word.specialConjugationPostPositions.set('아', Word.prototype.toFamiliarPolite);
    Word.specialConjugationPostPositions.set('어', Word.prototype.toFamiliarPolite);
    Word.specialConjugationPostPositions.set('여', Word.prototype.toFamiliarPolite);
  }
}

Word.initPostPositions();
Word.initSpecialPostPositions();
