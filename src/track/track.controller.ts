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
import { TrackService } from './track.service';
import { CreateTrackDto, UpdateTrackDto } from './track.dto';
import { Track } from './track.entity';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  findAll(): Track[] {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Track {
    return this.trackService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackDto: CreateTrackDto): Track {
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Track {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.trackService.remove(id);
  }
}
