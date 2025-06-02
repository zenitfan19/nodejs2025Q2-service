import { Artist } from '../artist/artist.entity';
import { Album } from '../album/album.entity';
import { Track } from '../track/track.entity';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
