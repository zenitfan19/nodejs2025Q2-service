import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto, UpdateArtistDto } from './artist.dto';
import { validateUuid } from '../utils/uuid.util';
import { CascadeDeletionService } from '../utils/cascade-deletion.service';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    private readonly cascadeDeletionService: CascadeDeletionService,
  ) {}

  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find({
      relations: ['albums', 'tracks'],
    });
  }

  async findOne(id: string): Promise<Artist> {
    validateUuid(id);
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations: ['albums', 'tracks'],
    });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create({
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    });
    return await this.artistRepository.save(artist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);

    if (updateArtistDto.name !== undefined) {
      artist.name = updateArtistDto.name;
    }
    if (updateArtistDto.grammy !== undefined) {
      artist.grammy = updateArtistDto.grammy;
    }

    return await this.artistRepository.save(artist);
  }
  async remove(id: string): Promise<void> {
    const artist = await this.findOne(id);
    await this.artistRepository.remove(artist);
    await this.cascadeDeletionService.onArtistDeleted(id);
  }

  async exists(id: string): Promise<boolean> {
    try {
      await this.findOne(id);
      return true;
    } catch {
      return false;
    }
  }
}
