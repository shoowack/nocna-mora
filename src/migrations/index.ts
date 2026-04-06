import * as migration_20260404_000000_import_nocna_mora_videos from './20260404_000000_import_nocna_mora_videos'
import * as migration_20260328_025321_initial from './20260328_025321_initial'
import * as migration_20260328_191956 from './20260328_191956'
import * as migration_20260329_160105 from './20260329_160105'
import * as migration_20260401_232831 from './20260401_232831'

export const migrations = [
  {
    up: migration_20260328_025321_initial.up,
    down: migration_20260328_025321_initial.down,
    name: '20260328_025321_initial',
  },
  {
    up: migration_20260328_191956.up,
    down: migration_20260328_191956.down,
    name: '20260328_191956',
  },
  {
    up: migration_20260329_160105.up,
    down: migration_20260329_160105.down,
    name: '20260329_160105',
  },
  {
    up: migration_20260401_232831.up,
    down: migration_20260401_232831.down,
    name: '20260401_232831',
  },
  {
    up: migration_20260404_000000_import_nocna_mora_videos.up,
    down: migration_20260404_000000_import_nocna_mora_videos.down,
    name: '20260404_000000_import_nocna_mora_videos',
  },
]
