/**
 * Generate Korean number words
 */

import { hanjaNumbers, hanjaNumberSequence, koreanNumbers } from '../data/numbers';

export class NumberGen {

  /**
   * Convert a number to hanja number
   */
  public convertHanjaNumber(value: number): string {
    if (!Number.isInteger(value) || value < 0 || value > 99999) {
      return '';
    }

    if (hanjaNumbers[value]) {
      return hanjaNumbers[value];
    }

    const parts = `${value}`.split('').reverse();

    return parts.map((digit, pos) => {
      switch (+digit) {
      case 0:
        return '';
      case 1:
        return pos ? hanjaNumberSequence[pos] : hanjaNumbers[+digit];
      default:
        return hanjaNumbers[+digit] + hanjaNumberSequence[pos];
      }
    }).filter(result => !!result).reverse().join(' ');
  }

  /**
   * Convert a number to Korean number
   */
  public convertKoreanNumber(value: number): string {
    if (!Number.isInteger(value) || value < 0 || value > 199) {
      return '';
    }

    if (koreanNumbers[value]) {
      return koreanNumbers[value];
    }

    const parts = `${value}`.split('').reverse();

    return parts.map((digit, pos) => {
      if (!+digit) {
        return '';
      }

      const value = +digit * Math.pow(10, pos);

      return koreanNumbers[value];
    }).filter(result => !!result).reverse().join(' ');
  }

  /**
   * Generate the hanja number of an integer of given range
   * @param start - start value [inclusive]
   * @param end - end value [inclusive]
   */
  public genHanjaNumber(start: number, end: number): [number, string] {
    const number = this.genNumber(start, end);

    return [number, this.convertHanjaNumber(number)];
  }

  /**
   * Generate the Korean number of an integer of given range
   * @param start - start value [inclusive]
   * @param end - end value [inclusive]
   */
  public genKoreanNumber(start: number, end: number): [number, string] {
    const number = this.genNumber(start, end);

    return [number, this.convertKoreanNumber(number)];
  }

  /**
   * Generate an integer of given range
   * @param start - start value [inclusive]
   * @param end - end value [inclusive]
   */
  public genNumber(start: number, end: number): number {
    return Math.floor(start + Math.random() * end);
  }
}
