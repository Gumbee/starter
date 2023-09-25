import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CookiesService } from '../cookies/cookies.service';
import { CredentialsLoginDTO } from './dto/credentials-login.dto';
import { CredentialsSignupDTO } from './dto/credentials-signup.dto';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller(`auth`)
export class AuthController {
  constructor(
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

  @Get('/google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: Request) {}

  @Get('/google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: Request) {
    return {
      user: req.user,
    };
  }

  @Post(`signout`)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.cookiesService.clearUserTokenCookie(res);

    return 'success';
  }
}
