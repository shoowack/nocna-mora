import * as migration_20260328_025321_initial from './20260328_025321_initial';
import * as migration_20260328_191956 from './20260328_191956';

export const migrations = [
  {
    up: migration_20260328_025321_initial.up,
    down: migration_20260328_025321_initial.down,
    name: '20260328_025321_initial',
  },
  {
    up: migration_20260328_191956.up,
    down: migration_20260328_191956.down,
    name: '20260328_191956'
  },
];
