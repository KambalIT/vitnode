import { join } from 'path';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';

import { PrismaModule } from '../prisma/prisma.module';
import { GlobalCoreSessionsModule } from './core/sessions/core_sessions.module';
import { CoreModule } from './core/core.module';
import { AdminModule } from './admin/admin.module';
import { GlobalAdminSessionsModule } from './admin/core/sessions/admin_sessions.module';
import { ForumModule } from './forums/forum.module';

import { Ctx } from '@/types/context.type';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }): Ctx => ({ req, res })
    }),
    JwtModule.register({ global: true }),
    PrismaModule,
    GlobalCoreSessionsModule,
    GlobalAdminSessionsModule,
    CoreModule,
    AdminModule,
    ForumModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
      serveRoot: '/public'
    })
  ]
})
export class AppModule {}
