import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Track } from './track.entity';
import { CreateTrackDto, UpdateTrackDto } from './track.dto';
import { validateUuid } from '../utils/uuid.util';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    validateUuid(id);
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const track: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    this.tracks.push(track);
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    validateUuid(id);
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId || null;
    track.albumId = updateTrackDto.albumId || null;
    track.duration = updateTrackDto.duration;
    return track;
  }

  remove(id: string): void {
    validateUuid(id);
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }
    this.tracks.splice(index, 1);
  }

  exists(id: string): boolean {
    return this.tracks.some((track) => track.id === id);
  }

  onArtistDeleted(artistId: string): void {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  onAlbumDeleted(albumId: string): void {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
