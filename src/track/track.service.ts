import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './track.entity';
import { CreateTrackDto, UpdateTrackDto } from './track.dto';
import { validateUuid } from '../utils/uuid.util';
import { CascadeDeletionService } from '../utils/cascade-deletion.service';

@Injectable()
export class TrackService implements OnModuleInit {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    private readonly cascadeDeletionService: CascadeDeletionService,
  ) {}

  onModuleInit() {
    this.cascadeDeletionService.registerHandler(this);
  }

  async findAll(): Promise<Track[]> {
    return await this.trackRepository.find({ relations: ['artist', 'album'] });
  }

  async findOne(id: string): Promise<Track> {
    validateUuid(id);
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = this.trackRepository.create({
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    });
    return await this.trackRepository.save(track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.findOne(id);

    if (updateTrackDto.name !== undefined) {
      track.name = updateTrackDto.name;
    }
    if (updateTrackDto.artistId !== undefined) {
      track.artistId = updateTrackDto.artistId;
    }
    if (updateTrackDto.albumId !== undefined) {
      track.albumId = updateTrackDto.albumId;
    }
    if (updateTrackDto.duration !== undefined) {
      track.duration = updateTrackDto.duration;
    }

    return await this.trackRepository.save(track);
  }

  async remove(id: string): Promise<void> {
    const track = await this.findOne(id);
    await this.trackRepository.remove(track);
    await this.cascadeDeletionService.onTrackDeleted(id);
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
    await this.trackRepository.update({ artistId }, { artistId: null });
  }

  async onAlbumDeleted(albumId: string): Promise<void> {
    await this.trackRepository.update({ albumId }, { albumId: null });
  }
}
