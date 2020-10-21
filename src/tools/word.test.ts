import { Word } from './word';

describe('word analyser', () => {
  test('add post position to nouns', () => {
    expect(new Word('이름').addPostPosition('은')).toEqual('이름은');
    expect(new Word('이름').addPostPosition('는')).toEqual('이름은');
    expect(new Word('친구').addPostPosition('은')).toEqual('친구는');
    expect(new Word('친구').addPostPosition('는')).toEqual('친구는');
  });

  test('add post position to verbs', () => {
    expect(new Word('가다').addPostPosition('습니다')).toEqual('갑니다');
    expect(new Word('먹다').addPostPosition('습니다')).toEqual('먹습니다');
    expect(new Word('가다').addPostPosition('ㅂ니다')).toEqual('갑니다');
    expect(new Word('먹다').addPostPosition('ㅂ니다')).toEqual('먹습니다');
    expect(new Word('살다').addPostPosition('습니다')).toEqual('삽니다');
    expect(new Word('살다').addPostPosition('ㅂ니다')).toEqual('삽니다');

    expect(new Word('가다').addPostPosition('시')).toEqual('가시');
    expect(new Word('읽다').addPostPosition('시')).toEqual('읽으시');
    expect(new Word('가다').addPostPosition('으시')).toEqual('가시');
    expect(new Word('읽다').addPostPosition('으시')).toEqual('읽으시');

    expect(new Word('가다').addPostPosition('ㄹ까요')).toEqual('갈까요');
    expect(new Word('읽다').addPostPosition('ㄹ까요')).toEqual('읽을까요');
    expect(new Word('가다').addPostPosition('을까요')).toEqual('갈까요');
    expect(new Word('읽다').addPostPosition('을까요')).toEqual('읽을까요');
    expect(new Word('살다').addPostPosition('ㄹ까요')).toEqual('살까요');
    expect(new Word('살다').addPostPosition('을까요')).toEqual('살까요');

    expect(new Word('가다').addPostPosition('ㅂ시다')).toEqual('갑시다');
    expect(new Word('읽다').addPostPosition('ㅂ시다')).toEqual('읽읍시다');
    expect(new Word('가다').addPostPosition('읍시다')).toEqual('갑시다');
    expect(new Word('읽다').addPostPosition('읍시다')).toEqual('읽읍시다');
    expect(new Word('살다').addPostPosition('ㅂ시다')).toEqual('삽시다');
    expect(new Word('살다').addPostPosition('읍시다')).toEqual('삽시다');

    expect(new Word('가다').addPostPosition('십시오')).toEqual('가십시오');
    expect(new Word('읽다').addPostPosition('십시오')).toEqual('읽으십시오');
    expect(new Word('가다').addPostPosition('으십시오')).toEqual('가십시오');
    expect(new Word('읽다').addPostPosition('으십시오')).toEqual('읽으십시오');
    expect(new Word('살다').addPostPosition('십시오')).toEqual('사십시오');
    expect(new Word('살다').addPostPosition('으십시오')).toEqual('사십시오');

    expect(new Word('가다').addPostPosition('아')).toEqual('가');
    expect(new Word('가다').addPostPosition('어')).toEqual('가');
    expect(new Word('서다').addPostPosition('아')).toEqual('서');
    expect(new Word('서다').addPostPosition('어')).toEqual('서');
    expect(new Word('쓰다').addPostPosition('아')).toEqual('써');
    expect(new Word('쓰다').addPostPosition('어')).toEqual('써');
    expect(new Word('오다').addPostPosition('아')).toEqual('와');
    expect(new Word('배우다').addPostPosition('아')).toEqual('배워');
    expect(new Word('기다리다').addPostPosition('아')).toEqual('기다려');
    expect(new Word('일하다').addPostPosition('아')).toEqual('일해');
  });
});
