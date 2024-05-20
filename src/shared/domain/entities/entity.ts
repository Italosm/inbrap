import { v4 as uuidv4 } from 'uuid';

export abstract class Entity<Props = any> {
  public readonly id: string;
  public readonly props: Props;

  constructor(props: Props, _id?: string) {
    this.props = props;
    this.id = _id || uuidv4();
  }

  get _id() {
    return this.id;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
