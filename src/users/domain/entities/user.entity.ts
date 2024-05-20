import { Entity } from '@/shared/domain/entities/entity';
import { UserValidatorFactory } from '../validators/user.validator';

export enum UserRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
  ASSISTANT = 'assistant',
}
export type UserProps = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  status?: boolean;
  roles?: UserRoles[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    UserEntity.validate(props);
    super(props, id);
    this.props.avatar = this.props.avatar ?? null;
    this.props.status = this.props.status ?? false;
    this.props.roles = this.props.roles ?? [UserRoles.USER];
    this.props.createdAt = this.props.createdAt ?? new Date();
    this.props.updatedAt = this.props.updatedAt ?? new Date();
  }
  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get email() {
    return this.props.email;
  }

  private set email(value: string) {
    this.props.email = value;
  }

  get password() {
    return this.props.password;
  }

  private set password(value: string) {
    this.props.password = value;
  }

  get avatar() {
    return this.props.avatar;
  }

  private set avatar(value: string) {
    this.props.avatar = value;
  }

  get status() {
    return this.props.status;
  }

  private set status(value: boolean) {
    this.props.status = value;
  }

  get roles() {
    return this.props.roles;
  }

  private set roles(value: UserRoles[]) {
    this.props.roles = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  update(props: Partial<UserProps>): void {
    UserEntity.validate({
      ...this.props,
      ...props,
    });
    const updatedProps: Partial<UserProps> = {
      name: props.name ?? this.name,
      email: props.email ?? this.email,
    };
    Object.assign(this.props, updatedProps);
    this.updateTimestamp();
  }

  updateRoles(value: UserRoles[]): void {
    UserEntity.validate({
      ...this.props,
      roles: value,
    });
    this.roles = value;
    this.updateTimestamp();
  }

  updateStatus(value: boolean): void {
    UserEntity.validate({
      ...this.props,
      status: value,
    });
    this.status = value;
    this.updateTimestamp();
  }

  updateAvatar(value: string): void {
    UserEntity.validate({
      ...this.props,
      avatar: value,
    });
    this.avatar = value;
    this.updateTimestamp();
  }

  updatePassword(value: string): void {
    UserEntity.validate({
      ...this.props,
      password: value,
    });
    this.password = value;
    this.updateTimestamp();
  }

  static validate(props: UserProps) {
    const validator = UserValidatorFactory.create();
    validator.validate(props);
  }
}
