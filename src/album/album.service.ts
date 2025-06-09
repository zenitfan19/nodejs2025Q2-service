import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './album.dto';
import { validateUuid } from '../utils/uuid.util';
import { CascadeDeletionService } from '../utils/cascade-deletion.service';

@Injectable()
export class AlbumService implements OnModuleInit {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    private readonly cascadeDeletionService: CascadeDeletionService,
  ) {}

  onModuleInit() {
    this.cascadeDeletionService.registerHandler(this);
  }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find({ relations: ['artist'] });
  }

  async findOne(id: string): Promise<Album> {
    validateUuid(id);
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['artist', 'tracks'],
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = this.albumRepository.create({
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    });
    return await this.albumRepository.save(album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);

    if (updateAlbumDto.name !== undefined) {
      album.name = updateAlbumDto.name;
    }
    if (updateAlbumDto.year !== undefined) {
      album.year = updateAlbumDto.year;
    }
    if (updateAlbumDto.artistId !== undefined) {
      album.artistId = updateAlbumDto.artistId;
    }

    return await this.albumRepository.save(album);
  }
  async remove(id: string): Promise<void> {
    const album = await this.findOne(id);
    await this.albumRepository.remove(album);
    await this.cascadeDeletionService.onAlbumDeleted(id);
  }

  async exists(id: string): Promise<boolean> {
    try {
      await this.findOne(id);
      return true;
    } catch {
      return false;
    }
  }

  async onArtistDeleted(artistId: string): Promise<void> {
    await this.albumRepository.update({ artistId }, { artistId: null });
  }
}
