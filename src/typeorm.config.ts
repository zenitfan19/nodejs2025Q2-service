import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Artist } from './artist/artist.entity';
import { Album } from './album/album.entity';
import { Track } from './track/track.entity';
import { Favorites } from './favorites/favorites.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'home_library',
  entities: [User, Artist, Album, Track, Favorites],
  synchronize: true,
};
