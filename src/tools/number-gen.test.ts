import { NumberGen } from './number-gen';

describe('number generator', () => {
  const numberGen = new NumberGen();

  test('generator a number of given range', () => {
    const value = numberGen.genNumber(1, 10);

    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(10);
  });

  test('convert a number to hanja number', () => {
    expect(numberGen.convertHanjaNumber(1)).toEqual('일');
    expect(numberGen.convertHanjaNumber(15)).toEqual('십 오');
    expect(numberGen.convertHanjaNumber(23)).toEqual('이십 삼');
    expect(numberGen.convertHanjaNumber(40)).toEqual('사십');
    expect(numberGen.convertHanjaNumber(106)).toEqual('백 육');
    expect(numberGen.convertHanjaNumber(116)).toEqual('백 십 육');
    expect(numberGen.convertHanjaNumber(378)).toEqual('삼백 칠십 팔');
    expect(numberGen.convertHanjaNumber(1001)).toEqual('천 일');
    expect(numberGen.convertHanjaNumber(2378)).toEqual('이천 삼백 칠십 팔');
    expect(numberGen.convertHanjaNumber(10091)).toEqual('만 구십 일');
    expect(numberGen.convertHanjaNumber(23780)).toEqual('이만 삼천 칠백 팔십');
  });

  test('convert a number to Korean number', () => {
    expect(numberGen.convertKoreanNumber(1)).toEqual('하나');
    expect(numberGen.convertKoreanNumber(15)).toEqual('열 다섯');
    expect(numberGen.convertKoreanNumber(23)).toEqual('스물 셋');
    expect(numberGen.convertKoreanNumber(40)).toEqual('마흔');
    expect(numberGen.convertKoreanNumber(106)).toEqual('백 여섯');
    expect(numberGen.convertKoreanNumber(116)).toEqual('백 열 여섯');
  });

  test('generate a hanja number', () => {
    expect(numberGen.genHanjaNumber(1, 100)).toBeTruthy();
  });

  test('generate a Korean number', () => {
    expect(numberGen.genKoreanNumber(1, 100)).toBeTruthy();
  });
});
