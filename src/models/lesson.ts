/**
 * Data of a lesson
 */

export class Lesson {
  public book: number = 0;
  public lesson: number = 0;
  public name: string = '';

  constructor(data: Partial<Lesson>) {
    Object.assign(this, data);
  }
}
