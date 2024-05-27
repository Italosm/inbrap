import { UserRoles } from '@/users/domain/entities/user.entity';
import { UserPresenter } from '../../user.presenter';
import { instanceToPlain } from 'class-transformer';

describe('UserPresenter unit tests', () => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const props = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    name: 'test name',
    email: 'a@a.com',
    password: 'fake',
    status: true,
    avatar: 'image.png',
    roles: [UserRoles.ADMIN],
    createdAt,
    updatedAt,
  };

  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe('constructor', () => {
    it('should set values', () => {
      const sut = new UserPresenter(props);
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.avatar).toEqual(props.avatar);
      expect(sut.status).toEqual(props.status);
      expect(sut.roles).toEqual(props.roles);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
      expect(sut.updatedAt).toEqual(props.updatedAt);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
        name: 'test name',
        email: 'a@a.com',
        status: true,
        avatar: 'image.png',
        roles: [UserRoles.ADMIN],
        updatedAt: updatedAt.toISOString(),
        createdAt: createdAt.toISOString(),
      });
    });
  });
});
