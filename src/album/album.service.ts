import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Album } from './album.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './album.dto';
import { validateUuid } from '../utils/uuid.util';
import { CascadeDeletionService } from '../utils/cascade-deletion.service';

@Injectable()
export class AlbumService implements OnModuleInit {
  private albums: Album[] = [];

  constructor(
    private readonly cascadeDeletionService: CascadeDeletionService,
  ) {}

  onModuleInit() {
    this.cascadeDeletionService.registerHandler(this);
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    validateUuid(id);
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const album: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    this.albums.push(album);
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    validateUuid(id);
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId || null;
    return album;
  }
  remove(id: string): void {
    validateUuid(id);
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }
    this.albums.splice(index, 1);

    this.cascadeDeletionService.onAlbumDeleted(id);
  }

  exists(id: string): boolean {
    return this.albums.some((album) => album.id === id);
  }

  onArtistDeleted(artistId: string): void {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
