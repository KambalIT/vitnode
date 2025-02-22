import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UAParser } from 'ua-parser-js';
import { Response } from 'express';

import { InternalAuthorizationCoreSessionObj } from './dto/internal_authorization.obj';

import { PrismaService } from '@/prisma/prisma.service';
import { Ctx } from '@/types/context.type';
import { CONFIG } from '@/config';
import { AccessDeniedError } from '@/utils/errors/AccessDeniedError';
import { convertUnixTime, currentDate } from '@/functions/date';

@Injectable()
export class InternalAuthorizationCoreSessionsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  protected clearCookies({ cookie, res }: { cookie: string; res: Response }) {
    res.clearCookie(cookie, {
      httpOnly: true,
      secure: true,
      domain: CONFIG.cookie.domain,
      path: '/'
    });
  }

  async authorization({ req, res }: Ctx): Promise<InternalAuthorizationCoreSessionObj> {
    const tokens = {
      accessToken: req.cookies[CONFIG.access_token.name],
      refreshToken: req.cookies[CONFIG.refresh_token.name]
    };

    // If access token exists, check it
    if (tokens.accessToken) {
      const session = await this.prisma.core_sessions.findUnique({
        where: {
          access_token: tokens.accessToken
        }
      });

      if (!session || session.access_token !== tokens.accessToken) {
        this.clearCookies({ res, cookie: tokens.accessToken });
        throw new AccessDeniedError();
      }

      const decodeAccessToken = this.jwtService.decode(tokens.accessToken);
      // If access token is invalid or expired, clear cookies
      if (decodeAccessToken && decodeAccessToken['exp'] > currentDate()) {
        const user = await this.prisma.core_members.findUnique({
          where: {
            id: session.member_id
          }
        });

        if (!user) {
          throw new AccessDeniedError();
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          birthday: user.birthday,
          newsletter: user.newsletter,
          group_id: user.group_id,
          avatar_color: user.avatar_color
        };
      }
    }

    // You don't have access token, but you have refresh token
    if (tokens.refreshToken) {
      const session = await this.prisma.core_sessions.findUnique({
        where: {
          refresh_token: tokens.refreshToken
        }
      });

      if (!session || session.refresh_token !== tokens.refreshToken) {
        this.clearCookies({ res, cookie: tokens.refreshToken });
        this.clearCookies({ res, cookie: tokens.accessToken });
        res.clearCookie(CONFIG.access_token.name);
        res.clearCookie(CONFIG.refresh_token.name);
        throw new AccessDeniedError();
      }

      const decodeRefreshToken = this.jwtService.decode(tokens.refreshToken);
      // If refresh token is invalid or expired, clear cookies
      if (!decodeRefreshToken || decodeRefreshToken['exp'] < currentDate()) {
        this.clearCookies({ res, cookie: tokens.refreshToken });
        this.clearCookies({ res, cookie: tokens.accessToken });

        throw new AccessDeniedError();
      }

      const user = await this.prisma.core_members.findUnique({
        where: {
          id: session.member_id
        }
      });

      if (!user) {
        throw new AccessDeniedError();
      }

      // Create new access token
      const currentAccessToken = this.jwtService.sign(
        {
          name: user.name,
          email: user.email
        },
        {
          secret: CONFIG.access_token.secret,
          expiresIn: 60 * 15 // 15 min
        }
      );

      // Update session
      const uaParser = new UAParser(req.headers['user-agent']);
      const uaParserResults = uaParser.getResult();
      await this.prisma.core_sessions.update({
        where: { refresh_token: session.refresh_token },
        data: {
          access_token: currentAccessToken,
          last_seen: currentDate(),
          ip_address: req.ip,
          member_id: user.id,
          user_agent: req.headers['user-agent'],
          uagent_browser: uaParserResults.browser.name,
          uagent_version: uaParserResults.browser.version,
          uagent_os: `${uaParserResults.os.name} ${uaParserResults.os.version}`,
          uagent_device_vendor: uaParserResults.device.vendor,
          uagent_device_model: uaParserResults.device.model,
          uagent_device_type: uaParserResults.device.type
        }
      });

      // Create cookie
      res.cookie(CONFIG.access_token.name, currentAccessToken, {
        httpOnly: true,
        secure: true,
        domain: CONFIG.cookie.domain,
        path: '/',
        expires: new Date(convertUnixTime(currentDate() + 60 * 15)), // 15 min
        sameSite: 'none'
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        birthday: user.birthday,
        newsletter: user.newsletter,
        group_id: user.group_id,
        avatar_color: user.avatar_color
      };
    }

    // Still here? Throw error
    this.clearCookies({ res, cookie: tokens.refreshToken });
    this.clearCookies({ res, cookie: tokens.accessToken });
    throw new AccessDeniedError();
  }
}
