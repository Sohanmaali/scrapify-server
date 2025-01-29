import { Module } from '@nestjs/common';
import { TaskManagerService } from './TaskManager.service';
import { TaskManagerController } from './TaskManager.controller';

@Module({
  providers: [TaskManagerService],
  controllers: [TaskManagerController]
})

export class TaskManagerModule {}
