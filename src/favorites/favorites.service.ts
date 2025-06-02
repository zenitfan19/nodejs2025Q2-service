import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  OnModuleInit,
} from '@nestjs/common';
import { Favorites, FavoritesResponse } from './favorites.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { validateUuid } from '../utils/uuid.util';
import { CascadeDeletionService } from '../utils/cascade-deletion.service';

@Injectable()
export class FavoritesService implements OnModuleInit {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly cascadeDeletionService: CascadeDeletionService,
  ) {}

  onModuleInit() {
    this.cascadeDeletionService.registerHandler(this);
  }

  findAll(): FavoritesResponse {
    const favoriteArtists = this.favorites.artists
      .map((id) => {
        try {
          return this.artistService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((artist) => artist !== null);

    const favoriteAlbums = this.favorites.albums
      .map((id) => {
        try {
          return this.albumService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((album) => album !== null);

    const favoriteTracks = this.favorites.tracks
      .map((id) => {
        try {
          return this.trackService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((track) => track !== null);

    return {
      artists: favoriteArtists,
      albums: favoriteAlbums,
      tracks: favoriteTracks,
    };
  }

  addTrack(id: string): void {
    validateUuid(id);
    if (!this.trackService.exists(id)) {
      throw new UnprocessableEntityException('Track not found');
    }
    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  removeTrack(id: string): void {
    validateUuid(id);
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }
    this.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string): void {
    validateUuid(id);
    if (!this.albumService.exists(id)) {
      throw new UnprocessableEntityException('Album not found');
    }
    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  removeAlbum(id: string): void {
    validateUuid(id);
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }
    this.favorites.albums.splice(index, 1);
  }

  addArtist(id: string): void {
    validateUuid(id);
    if (!this.artistService.exists(id)) {
      throw new UnprocessableEntityException('Artist not found');
    }
    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  removeArtist(id: string): void {
    validateUuid(id);
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }
    this.favorites.artists.splice(index, 1);
  }

  onArtistDeleted(artistId: string): void {
    const index = this.favorites.artists.indexOf(artistId);
    if (index !== -1) {
      this.favorites.artists.splice(index, 1);
    }
  }

  onAlbumDeleted(albumId: string): void {
    const index = this.favorites.albums.indexOf(albumId);
    if (index !== -1) {
      this.favorites.albums.splice(index, 1);
    }
  }

  onTrackDeleted(trackId: string): void {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index !== -1) {
      this.favorites.tracks.splice(index, 1);
    }
  }
}
