/**
 * The response returned by querying word entry of naver dictionary
 * - e.g. https://zh.dict.naver.com/api/platform/zhko/entry.nhn?entryId=bf1b2e6170f64fd2b1576c17229ef9fa
 */

export interface NaverEntryResponse {
  entry: {
    group: {
      entryCommon: {
        korean_pron: string;
        pron_file_female?: string;
        pron_file_male?: string;
      };
    };
  };
}
