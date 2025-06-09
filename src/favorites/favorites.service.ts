import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites, FavoritesResponse } from './favorites.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { validateUuid } from '../utils/uuid.util';
import { CascadeDeletionService } from '../utils/cascade-deletion.service';

@Injectable()
export class FavoritesService implements OnModuleInit {
  constructor(
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly cascadeDeletionService: CascadeDeletionService,
  ) {}

  onModuleInit() {
    this.cascadeDeletionService.registerHandler(this);
  }

  private async getFavoritesRecord(): Promise<Favorites> {
    let favorites = await this.favoritesRepository.findOne({
      where: { userId: 'default' },
      relations: ['artists', 'albums', 'tracks'],
    });

    if (!favorites) {
      favorites = this.favoritesRepository.create({
        userId: 'default',
        artists: [],
        albums: [],
        tracks: [],
      });
      favorites = await this.favoritesRepository.save(favorites);
    }

    return favorites;
  }

  async findAll(): Promise<FavoritesResponse> {
    const favorites = await this.getFavoritesRecord();

    return {
      artists: favorites.artists,
      albums: favorites.albums,
      tracks: favorites.tracks,
    };
  }

  async addTrack(id: string): Promise<void> {
    validateUuid(id);

    const trackExists = await this.trackService.exists(id);
    if (!trackExists) {
      throw new UnprocessableEntityException('Track not found');
    }

    const track = await this.trackService.findOne(id);
    const favorites = await this.getFavoritesRecord();

    const isAlreadyFavorite = favorites.tracks.some((t) => t.id === id);
    if (!isAlreadyFavorite) {
      favorites.tracks.push(track);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeTrack(id: string): Promise<void> {
    validateUuid(id);

    const favorites = await this.getFavoritesRecord();
    const trackIndex = favorites.tracks.findIndex((t) => t.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Track is not in favorites');
    }

    favorites.tracks.splice(trackIndex, 1);
    await this.favoritesRepository.save(favorites);
  }

  async addAlbum(id: string): Promise<void> {
    validateUuid(id);

    const albumExists = await this.albumService.exists(id);
    if (!albumExists) {
      throw new UnprocessableEntityException('Album not found');
    }

    const album = await this.albumService.findOne(id);
    const favorites = await this.getFavoritesRecord();

    const isAlreadyFavorite = favorites.albums.some((a) => a.id === id);
    if (!isAlreadyFavorite) {
      favorites.albums.push(album);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    validateUuid(id);

    const favorites = await this.getFavoritesRecord();
    const albumIndex = favorites.albums.findIndex((a) => a.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album is not in favorites');
    }

    favorites.albums.splice(albumIndex, 1);
    await this.favoritesRepository.save(favorites);
  }

  async addArtist(id: string): Promise<void> {
    validateUuid(id);

    const artistExists = await this.artistService.exists(id);
    if (!artistExists) {
      throw new UnprocessableEntityException('Artist not found');
    }

    const artist = await this.artistService.findOne(id);
    const favorites = await this.getFavoritesRecord();

    const isAlreadyFavorite = favorites.artists.some((a) => a.id === id);
    if (!isAlreadyFavorite) {
      favorites.artists.push(artist);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeArtist(id: string): Promise<void> {
    validateUuid(id);

    const favorites = await this.getFavoritesRecord();
    const artistIndex = favorites.artists.findIndex((a) => a.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }

    favorites.artists.splice(artistIndex, 1);
    await this.favoritesRepository.save(favorites);
  }

  async onArtistDeleted(artistId: string): Promise<void> {
    const favorites = await this.getFavoritesRecord();
    const artistIndex = favorites.artists.findIndex((a) => a.id === artistId);

    if (artistIndex !== -1) {
      favorites.artists.splice(artistIndex, 1);
      await this.favoritesRepository.save(favorites);
    }
  }

  async onAlbumDeleted(albumId: string): Promise<void> {
    const favorites = await this.getFavoritesRecord();
    const albumIndex = favorites.albums.findIndex((a) => a.id === albumId);

    if (albumIndex !== -1) {
      favorites.albums.splice(albumIndex, 1);
      await this.favoritesRepository.save(favorites);
    }
  }

  async onTrackDeleted(trackId: string): Promise<void> {
    const favorites = await this.getFavoritesRecord();
    const trackIndex = favorites.tracks.findIndex((t) => t.id === trackId);

    if (trackIndex !== -1) {
      favorites.tracks.splice(trackIndex, 1);
      await this.favoritesRepository.save(favorites);
    }
  }
}
