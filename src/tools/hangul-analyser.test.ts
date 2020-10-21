import { HangulAnalyser } from './hangul-analyser';

describe('hangul analyser', () => {
  const hangulAnalyser = new HangulAnalyser();

  test('add lead', () => {
    expect(hangulAnalyser.addLead('ㅏ', 'ㄱ')).toEqual('가');
    expect(hangulAnalyser.addLead('ㅙ', 'ᄋ')).toEqual('왜');
    expect(hangulAnalyser.addLead('ㅣ', 'ㅎ')).toEqual('히');
  });

  test('add tail', () => {
    expect(hangulAnalyser.addTail('가', 'ㄱ')).toEqual('각');
    expect(hangulAnalyser.addTail('가', 'ㅇ')).toEqual('강');
    expect(hangulAnalyser.addTail('가', 'ㅎ')).toEqual('갛');
  });

  test('has tail', () => {
    expect(hangulAnalyser.hasTail('가')).toEqual(false);
    expect(hangulAnalyser.hasTail('a')).toEqual(false);
    expect(hangulAnalyser.hasTail('X')).toEqual(false);
    expect(hangulAnalyser.hasTail('각')).toEqual(true);
    expect(hangulAnalyser.hasTail('강')).toEqual(true);
    expect(hangulAnalyser.hasTail('갛')).toEqual(true);
  });

  test('is tail', () => {
    expect(hangulAnalyser.isTail('ㄱ')).toEqual(true);
    expect(hangulAnalyser.isTail('ㅇ')).toEqual(true);
    expect(hangulAnalyser.isTail('ㅎ')).toEqual(true);
    expect(hangulAnalyser.isTail('가')).toEqual(false);
  });

  test('merge vowel', () => {
    expect(hangulAnalyser.mergeVowel('가', 'ㅏ')).toEqual('가');
    expect(hangulAnalyser.mergeVowel('그', 'ㅓ')).toEqual('거');
    expect(hangulAnalyser.mergeVowel('고', 'ㅏ')).toEqual('과');
    expect(hangulAnalyser.mergeVowel('구', 'ㅓ')).toEqual('궈');
    expect(hangulAnalyser.mergeVowel('기', 'ㅓ')).toEqual('겨');
    expect(hangulAnalyser.mergeVowel('내', 'ㅓ')).toEqual('내');
    expect(hangulAnalyser.mergeVowel('하', 'ㅕ')).toEqual('해');
  });

  test('parses lead consonants', () => {
    expect(hangulAnalyser.parseLead('간')).toEqual('ㄱ');
    expect(hangulAnalyser.parseLead('앙')).toEqual('ᄋ');
    expect(hangulAnalyser.parseLead('함')).toEqual('ㅎ');
  });

  test('parses tails', () => {
    expect(hangulAnalyser.parseTail('가')).toEqual('');
    expect(hangulAnalyser.parseTail('각')).toEqual('ㄱ');
    expect(hangulAnalyser.parseTail('강')).toEqual('ㅇ');
    expect(hangulAnalyser.parseTail('갛')).toEqual('ㅎ');
  });

  test('parses vowels', () => {
    expect(hangulAnalyser.parseVowel('각')).toEqual('ㅏ');
    expect(hangulAnalyser.parseVowel('괭')).toEqual('ㅙ');
    expect(hangulAnalyser.parseVowel('깋')).toEqual('ㅣ');
  });

  test('remove tail', () => {
    expect(hangulAnalyser.removeTail('각')).toEqual('가');
    expect(hangulAnalyser.removeTail('강')).toEqual('가');
    expect(hangulAnalyser.removeTail('갛')).toEqual('가');
  });
});
