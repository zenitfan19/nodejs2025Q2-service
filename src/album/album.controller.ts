import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './album.dto';
import { Album } from './album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  findAll(): Album[] {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Album {
    return this.albumService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Album {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.albumService.remove(id);
  }
}
