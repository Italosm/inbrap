import { UserEntity, UserProps, UserRoles } from '../../user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserEntity unit tests', () => {
  let props: UserProps;
  let sut: UserEntity;

  beforeEach(() => {
    props = UserDataBuilder({});
    sut = new UserEntity(props);
  });

  it('Constructor method with default values for role and status', () => {
    expect(sut.id).toBeDefined();
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.roles).toEqual([UserRoles.USER]);
    expect(sut.props.avatar).toEqual(props.avatar);
    expect(sut.props.status).toEqual(false);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
    expect(sut.props.updatedAt).toBeInstanceOf(Date);
  });
  it('Constructor method with provided role and status', () => {
    const customRole = [UserRoles.ADMIN];
    const customStatus = true;
    const propsWithCustomValues: UserProps = UserDataBuilder({
      ...props,
      roles: customRole,
      status: customStatus,
    });
    sut = new UserEntity(propsWithCustomValues);

    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.avatar).toEqual(props.avatar);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.roles).toEqual(customRole);
    expect(sut.props.status).toEqual(customStatus);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
    expect(sut.props.updatedAt).toBeInstanceOf(Date);
  });

  it('Getter of name field', () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe('string');
  });

  it('Setter of name field', () => {
    sut['name'] = 'other name';
    expect(sut.name).toEqual('other name');
    expect(typeof sut.name).toBe('string');
  });

  it('Getter of email field', () => {
    expect(sut.email).toBeDefined();
    expect(sut.email).toEqual(props.email);
    expect(typeof sut.email).toBe('string');
  });

  it('Setter of email field', () => {
    sut['email'] = 'other@email.com';
    expect(sut.email).toEqual('other@email.com');
    expect(typeof sut.email).toBe('string');
  });

  it('Getter of avatar field', () => {
    expect(sut.avatar).toBeDefined();
    expect(sut.avatar).toEqual(props.avatar);
    expect(typeof sut.avatar).toBe('string');
  });

  it('Setter of avatar field', () => {
    sut['avatar'] = 'other avatar';
    expect(sut.avatar).toEqual('other avatar');
    expect(typeof sut.avatar).toBe('string');
  });

  it('Getter of password field', () => {
    expect(sut.password).toBeDefined();
    expect(sut.password).toEqual(props.password);
    expect(typeof sut.password).toBe('string');
  });

  it('Setter of password field', () => {
    sut['password'] = 'otherPassword123';
    expect(sut.password).toEqual('otherPassword123');
    expect(typeof sut.password).toBe('string');
  });

  it('Getter of default roles field', () => {
    expect(sut.roles).toBeDefined();
    expect(sut.roles).toEqual(props.roles);
    expect(sut.roles).toEqual([UserRoles.USER]);
  });

  it('Setter of roles field', () => {
    sut['roles'] = [UserRoles.OWNER];
    expect(sut.roles).toEqual([UserRoles.OWNER]);
  });

  it('Getter of status field', () => {
    expect(sut.status).toBeDefined();
    expect(sut.status).toEqual(props.status);
    expect(typeof sut.status).toBe('boolean');
  });

  it('Setter of status field', () => {
    sut['status'] = true;
    expect(sut.status).toEqual(true);
    expect(typeof sut.status).toBe('boolean');
  });

  it('Getter of User with provided role and status', () => {
    const customRole = [UserRoles.ADMIN];
    const customStatus = true;
    const propsWithCustomValues: UserProps = UserDataBuilder({
      roles: customRole,
      status: customStatus,
    });
    sut = new UserEntity(propsWithCustomValues);
    expect(sut.roles).toBeDefined();
    expect(sut.roles).toEqual(customRole);
    expect(sut.roles).toEqual([UserRoles.ADMIN]);
    expect(sut.status).toBeDefined();
    expect(sut.status).toEqual(customStatus);
    expect(typeof sut.status).toBe('boolean');
  });

  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
  });

  it('Getter of updatedAt field', () => {
    expect(sut.updatedAt).toBeDefined();
    expect(sut.updatedAt).toBeInstanceOf(Date);
  });

  it('Setter of updatedAt field', () => {
    const date = new Date();
    sut['updatedAt'] = date;
    expect(sut.updatedAt).toEqual(date);
    expect(sut.updatedAt).toBeDefined();
    expect(sut.updatedAt).toBeInstanceOf(Date);
  });

  it('Should update a user', () => {
    const updateTimestampSpy = jest.spyOn(sut as any, 'updateTimestamp');
    const name = 'other name';
    const email = 'other@email.com';
    sut.update({ name, email });
    expect(sut.props.name).toEqual('other name');
    expect(sut.props.email).toEqual('other@email.com');
    expect(sut.props.updatedAt).not.toEqual(sut.props.createdAt);
    expect(updateTimestampSpy).toHaveBeenCalled();
    updateTimestampSpy.mockRestore();
  });

  it('Should update the roles field', () => {
    const updateTimestampSpy = jest.spyOn(sut as any, 'updateTimestamp');
    sut.updateRoles([UserRoles.ADMIN, UserRoles.USER]);
    expect(sut.props.roles).toEqual([UserRoles.ADMIN, UserRoles.USER]);
    expect(sut.props.updatedAt).not.toEqual(sut.props.createdAt);
    expect(updateTimestampSpy).toHaveBeenCalled();
    updateTimestampSpy.mockRestore();
  });

  it('Should update the avatar field', () => {
    const updateTimestampSpy = jest.spyOn(sut as any, 'updateTimestamp');
    sut.updateAvatar('otherAvatar.png');
    expect(sut.props.avatar).toEqual('otherAvatar.png');
    expect(sut.props.updatedAt).not.toEqual(sut.props.createdAt);
    expect(updateTimestampSpy).toHaveBeenCalled();
    updateTimestampSpy.mockRestore();
  });

  it('Should update the status field', () => {
    const updateTimestampSpy = jest.spyOn(sut as any, 'updateTimestamp');
    const oldStatus = sut.status;
    sut.updateStatus(!oldStatus);
    expect(sut.props.status).not.toEqual(oldStatus);
    expect(sut.props.updatedAt).not.toEqual(sut.props.createdAt);
    expect(updateTimestampSpy).toHaveBeenCalled();
    updateTimestampSpy.mockRestore();
  });

  it('Should update the password field', () => {
    const updateTimestampSpy = jest.spyOn(sut as any, 'updateTimestamp');
    sut.updatePassword('other password');
    expect(sut.props.password).toEqual('other password');
    expect(sut.props.updatedAt).not.toEqual(sut.props.createdAt);
    expect(updateTimestampSpy).toHaveBeenCalled();
    updateTimestampSpy.mockRestore();
  });
});
