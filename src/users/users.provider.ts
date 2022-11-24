import { USERS_REPOSITORY } from './const';
import { User } from './entities';

export const usersProvider = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
];
