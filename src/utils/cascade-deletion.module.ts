import { Global, Module } from '@nestjs/common';
import { CascadeDeletionService } from './cascade-deletion.service';

@Global()
@Module({
  providers: [CascadeDeletionService],
  exports: [CascadeDeletionService],
})
export class CascadeDeletionModule {}
