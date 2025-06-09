import { Injectable, OnModuleInit } from '@nestjs/common';

export interface CascadeDeletionHandler {
  onArtistDeleted?(artistId: string): Promise<void>;
  onAlbumDeleted?(albumId: string): Promise<void>;
  onTrackDeleted?(trackId: string): Promise<void>;
}

@Injectable()
export class CascadeDeletionService implements OnModuleInit {
  private handlers: CascadeDeletionHandler[] = [];

  onModuleInit() {}

  registerHandler(handler: CascadeDeletionHandler): void {
    this.handlers.push(handler);
  }

  async onArtistDeleted(artistId: string): Promise<void> {
    await Promise.all(
      this.handlers.map(async (handler) => {
        if (handler.onArtistDeleted) {
          await handler.onArtistDeleted(artistId);
        }
      }),
    );
  }

  async onAlbumDeleted(albumId: string): Promise<void> {
    await Promise.all(
      this.handlers.map(async (handler) => {
        if (handler.onAlbumDeleted) {
          await handler.onAlbumDeleted(albumId);
        }
      }),
    );
  }

  async onTrackDeleted(trackId: string): Promise<void> {
    await Promise.all(
      this.handlers.map(async (handler) => {
        if (handler.onTrackDeleted) {
          await handler.onTrackDeleted(trackId);
        }
      }),
    );
  }
}
