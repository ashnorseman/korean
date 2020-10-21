/**
 * The response returned by querying naver dictionary
 * - e.g. https://zh.dict.naver.com/api3/zhko/search?query=학생
 */

export interface NaverDictResponse {
  searchResultMap: {
    searchResultListMap: {
      WORD: {
        items: Array<{
          entryId: string;
          handleEntry: string;
          meansCollector: Array<{
            // POS
            partOfSpeech2: string;

            // Meaning
            means: Array<{
              exampleOri: string;
              exampleTrans: string;
              value: string;
            }>;
          }>;
          expAliasGeneralAlwaysList: Array<{

            // Hanja or English (or other languages)
            originLanguageValue: string;
          }>;
        }>;
      }
    }
  }
}
