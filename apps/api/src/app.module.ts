import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { WorkTypesModule } from "./work-types/work-types.module";
import { WorkLogsModule } from "./work-logs/work-logs.module";

@Module({
  imports: [PrismaModule, WorkTypesModule, WorkLogsModule],
  controllers: [AppController],
})
export class AppModule {}