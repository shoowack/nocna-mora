import * as migration_20260328_025321_initial from './20260328_025321_initial';

export const migrations = [
  {
    up: migration_20260328_025321_initial.up,
    down: migration_20260328_025321_initial.down,
    name: '20260328_025321_initial'
  },
];
