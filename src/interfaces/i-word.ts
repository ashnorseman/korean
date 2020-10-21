/**
 * Interface of a word
 */

export interface IWord {
  category?: string;
  description?: string;
  english?: string;
  example?: string;
  exampleTrans?: string;
  hanja?: string;
  hasAudio: boolean;
  meaning: string;
  pos: string;
  pronunciation: string;
  tags?: string[];
  wordName: string;
  ysBook?: number;
  ysUnit?: number;
}
