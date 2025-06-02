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
import { ArtistService } from './artist.service';
import { CreateArtistDto, UpdateArtistDto } from './artist.dto';
import { Artist } from './artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  findAll(): Artist[] {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Artist {
    return this.artistService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createArtistDto: CreateArtistDto): Artist {
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Artist {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.artistService.remove(id);
  }
}
