import { Body, Controller, Get, Post, Render, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CookiesService } from '../cookies/cookies.service';
import { CredentialsSignupDTO } from './dto/credentials-signup.dto';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { GoogleOAuthNativeGuard } from './guards/google-native.guard';
import { FrontendService } from '@modules/frontend/frontend.service';
import { ConfigService } from '@nestjs/config';
import { ERROR_CODES } from '@forge/common/errors';

@ApiTags('Authentication')
@Controller(`auth`)
export class AuthController {
  constructor(
    private config: ConfigService,
    private frontendService: FrontendService,
    private cookiesService: CookiesService,
    private authService: AuthService,
  ) {}

  @Post(`signin/credentials`)
  @UseGuards(LocalAuthGuard)
  async signin(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user!;

    this.cookiesService.setUserTokenCookie(res, user);

    return {
      user,
    };
  }

  @Post(`/signup/credentials`)
  async signup(@Body() credentials: CredentialsSignupDTO, @Res({ passthrough: true }) res: Response) {
    const existing = await this.authService.doesUserExist(credentials.email);

    if (existing) {
      throw new UnauthorizedException({ code: ERROR_CODES.USER_EXISTS, message: 'User with this email address exists already.' });
    }

    const { user } = await this.authService.createAccountFromCredentials(credentials);

    this.cookiesService.setUserTokenCookie(res, user);

    return {
      user,
    };
  }

  @Get('/oauth/google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('/oauth/google/callback')
  @UseGuards(GoogleOAuthGuard)
  @Render('oauth')
  googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user;

    if (!user) throw new UnauthorizedException({ code: ERROR_CODES.UNAUTHORIZED, message: 'User not found' });

    this.cookiesService.setUserTokenCookie(res, user);

    return {
      data: {
        user,
      },
      frontend: this.config.get(`FRONTEND_URL`),
    };
  }

  @Get('/oauth/native/google')
  @UseGuards(GoogleOAuthNativeGuard)
  async googleAuthNative() {}

  @Get('/oauth/native/google/callback')
  async googleAuthNativeCallback(@Req() req: Request, @Res() res: Response) {
    const query = req.url.split('?')[1];

    return res.redirect(this.frontendService.getFrontendPath('/auth/oauth/native/google') + `${query ? `?${query}` : ``}`);
  }

  @Post('/oauth/native/google/redeem')
  @UseGuards(GoogleOAuthNativeGuard)
  googleAuthRedirectNativeRedeem(@Req() req: Request, @Res() res: Response) {
    const user = req.user;

    if (!user) throw new UnauthorizedException({ code: ERROR_CODES.UNAUTHORIZED, message: 'User not found' });

    this.cookiesService.setUserTokenCookie(res, user);

    return res.json({
      user: user,
    });
  }

  @Post(`signout`)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.cookiesService.clearUserTokenCookie(res);

    return 'success';
  }
}
