import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CookiesService } from '../cookies/cookies.service';
import { CredentialsLoginDTO } from './dto/credentials-login.dto';
import { CredentialsSignupDTO } from './dto/credentials-signup.dto';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { GoogleOAuthNativeGuard } from './guards/google-native.guard';
import { FrontendService } from '@modules/frontend/frontend.service';

@ApiTags('Authentication')
@Controller(`auth`)
export class AuthController {
  constructor(
    private frontendService: FrontendService,
    private cookiesService: CookiesService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post(`signin/credentials`)
  async login(@Req() req: Request, @Body() credentials: CredentialsLoginDTO, @Res({ passthrough: true }) res: Response) {
    const user = req.user!;

    this.cookiesService.setUserTokenCookie(res, user);

    return {
      user,
    };
  }

  @Post(`/signup/credentials`)
  async signup(@Body() credentials: CredentialsSignupDTO, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.signupWithCredentials(credentials);

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
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const state = req.query.state ? JSON.parse(Buffer.from(req.query.state as string, 'base64').toString('utf-8')) : undefined;

    return res.json({
      user: req.user,
      state,
    });
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
    return res.json({
      user: req.user,
    });
  }

  @Post(`signout`)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.cookiesService.clearUserTokenCookie(res);

    return 'success';
  }
}
