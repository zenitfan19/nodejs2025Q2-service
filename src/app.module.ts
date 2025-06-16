import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CascadeDeletionModule } from './utils/cascade-deletion.module';
import { LoggingModule } from './logging/logging.module';
import { typeOrmConfig } from './typeorm/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LoggingModule,
    CascadeDeletionModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
