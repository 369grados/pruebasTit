import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ConfigEnvModule } from "./common/configuration/env/config-env.module"
import { MongodbModule } from "./common/database/mongodb.module"
import { AuthModule } from "./modules/auth/auth.module"
import { UsersModule } from "./modules/users/users.module"
import { TasksModule } from './modules/tasks/tasks.module';
import { EmailsModule } from './modules/emails/emails.module';

@Module({
	imports: [ConfigEnvModule, MongodbModule, AuthModule, UsersModule, TasksModule, EmailsModule],
	controllers: [],
	providers: [ConfigService],
	exports: [],
})
export class AppModule {}
