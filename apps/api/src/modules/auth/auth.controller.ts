import { Body, Controller, ForbiddenException, Get, Post, Render, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CookiesService } from '../cookies/cookies.service';
import { CredentialsSignupDTO } from './dto/credentials-signup.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { FrontendService } from '@modules/frontend/frontend.service';
import { ConfigService } from '@nestjs/config';
import { ERROR_CODES } from '@forge/common/errors';
import { GoogleSignInAuthGuard } from './guards/google-signin.guard';
import { GoogleSignUpAuthGuard } from './guards/google-signup.guard';
import { EntryCodeService } from '@modules/entry-code/entry-code.service';
import { GoogleOAuthNativeGuard } from './guards/google-native.guard';

@ApiTags('Authentication')
@Controller(`auth`)
export class AuthController {
  constructor(
    private config: ConfigService,
    private frontendService: FrontendService,
    private cookiesService: CookiesService,
    private authService: AuthService,
    private entryCodes: EntryCodeService,
  ) {}

  @Post(`signin/credentials`)
  @UseGuards(LocalAuthGuard)
  async signin(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user!;

    this.cookiesService.setUserTokenCookie(res, user);

    return user;
  }

  @Post(`/signup/credentials`)
  async signup(@Body() credentials: CredentialsSignupDTO, @Res({ passthrough: true }) res: Response) {
    const existing = await this.authService.doesUserExist(credentials.email);

    if (existing) {
      throw new UnauthorizedException({ code: ERROR_CODES.USER_EXISTS, message: 'User with this email address exists already.' });
    }

    const { valid: canSignUp, entry } = await this.authService.isEntryValid({
      entryCode: credentials.entryCode,
    });

    if (!canSignUp) {
      throw new ForbiddenException({
        code: ERROR_CODES.INVALID_ENTRY,
        message: 'Invalid entry code or invite',
      });
    }

    const { user } = await this.authService.createAccountFromCredentials(credentials, entry);

    if (credentials.entryCode) {
      await this.entryCodes.consumeEntryCode(credentials.entryCode).catch(() => {
        // TODO: handle error
      });
    }

    this.cookiesService.setUserTokenCookie(res, user);

    return user;
  }

  @Get('/oauth/signin/google')
  @UseGuards(GoogleSignInAuthGuard)
  async googleAuth() {}

  @Get('/oauth/signin/google/callback')
  @UseGuards(GoogleSignInAuthGuard)
  @Render('oauth')
  async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
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

  @Get('/oauth/signup/google')
  @UseGuards(GoogleSignUpAuthGuard)
  async googleAuthSignup() {}

  @Get('/oauth/signup/google/callback')
  @UseGuards(GoogleSignUpAuthGuard)
  @Render('oauth')
  async googleAuthSignupRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
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
