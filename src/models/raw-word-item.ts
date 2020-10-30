/**
 * Interface of a word
 */

export class RawWordItem {
  private static posSequence: string[] = ['名词', '动词', '形容词', '副词', '代名词', '依赖名词', '数词', '冠词', '助词', '感叹词'];

  public category?: string;
  public description?: string;
  public english?: string;
  public example?: string;
  public exampleTrans?: string;
  public hanja?: string;
  public hasAudio: boolean = false;
  public meaning: string = '';
  public pos: string = '';
  public pronunciation: string = '';
  public tags: string = '';
  public used: boolean = false;
  public wordName: string = '';
  public ysBook: number = 0;
  public ysUnit: number = 0;

  constructor(data: Partial<RawWordItem>) {
    Object.assign(this, data);
  }

  /**
   * Sort words
   */
  public compare(target: RawWordItem, options?: { wordNameBeforePos: boolean }): number {
    // if (this.used !== target.used) {
    //   return this.used ? -1 : 1;
    // }

    if (this.ysBook !== target.ysBook) {
      return this.ysBook - target.ysBook;
    }

    if (this.ysUnit !== target.ysUnit) {
      return this.ysUnit - target.ysUnit;
    }

    if (options?.wordNameBeforePos && (this.wordName !== target.wordName)) {
      return this.wordName.localeCompare(target.wordName);
    }

    if (this.pos !== target.pos) {
      const thisPosIndex = RawWordItem.posSequence.indexOf(this.pos);
      const targetPosIndex = RawWordItem.posSequence.indexOf(target.pos);

      return thisPosIndex - targetPosIndex;
    }

    if (this.tags !== target.tags) {
      if (!this.tags) {
        return 1;
      }

      if (!target.tags) {
        return -1;
      }

      return (this.tags || '').localeCompare(target.tags);
    }

    return this.wordName.localeCompare(target.wordName);
  }

  public toLine(): string {
    return [
        `${this.used ? '*' : ''}`,
        this.ysBook || '',
        this.ysUnit || '',
        this.wordName,
        this.pronunciation || '',
        this.hasAudio ? 'true' : 'false',
        this.pos || '',
        this.meaning || '',
        this.description || '',
        this.tags || '',
        this.example || '',
        this.exampleTrans || ''
    ].join('\t');
  }

  /**
   * Parse word from raw data
   */
  public static fromLine(line: string): RawWordItem {
    const data = line.split('\t');

    return new RawWordItem({
      used: data[0] === '*',
      ysBook: +data[1],
      ysUnit: +data[2],
      wordName: data[3],
      pronunciation: data[4],
      hasAudio: data[5] === 'true',
      pos: data[6],
      meaning: data[7],
      description: data[8],
      tags: data[9],
      example: data[10],
      exampleTrans: data[11]
    });
  }
}
