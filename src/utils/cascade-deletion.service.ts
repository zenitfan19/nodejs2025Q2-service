import { Injectable, OnModuleInit } from '@nestjs/common';

export interface CascadeDeletionHandler {
  onArtistDeleted?(artistId: string): void;
  onAlbumDeleted?(albumId: string): void;
  onTrackDeleted?(trackId: string): void;
}

@Injectable()
export class CascadeDeletionService implements OnModuleInit {
  private handlers: CascadeDeletionHandler[] = [];

  onModuleInit() {}

  registerHandler(handler: CascadeDeletionHandler): void {
    this.handlers.push(handler);
  }

  onArtistDeleted(artistId: string): void {
    this.handlers.forEach((handler) => {
      if (handler.onArtistDeleted) {
        handler.onArtistDeleted(artistId);
      }
    });
  }

  onAlbumDeleted(albumId: string): void {
    this.handlers.forEach((handler) => {
      if (handler.onAlbumDeleted) {
        handler.onAlbumDeleted(albumId);
      }
    });
  }

  onTrackDeleted(trackId: string): void {
    this.handlers.forEach((handler) => {
      if (handler.onTrackDeleted) {
        handler.onTrackDeleted(trackId);
      }
    });
  }
}
