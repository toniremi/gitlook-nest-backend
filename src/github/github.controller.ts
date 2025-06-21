import {
  Controller,
  Get,
  Query,
  Res,
  InternalServerErrorException,
  HttpStatus,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express'; // Import Response from express for redirection
import { GithubService } from './github.service';
import { ConfigService } from '@nestjs/config';

@Controller('github') // Base path for all routes in this controller: /dev/github
export class GithubController {
  private readonly GITHUB_CLIENT_ID: string;

  constructor(
    private readonly githubService: GithubService,
    private readonly configService: ConfigService,
  ) {
    this.GITHUB_CLIENT_ID = this.configService.get<string>('GITHUB_CLIENT_ID')!;
  }

  /**
   * Redirects to GitHub's authorization page to initiate the OAuth flow.
   * Access via: GET /dev/github/login
   */
  @Get('login')
  githubLogin(@Res() res: Response) {
    const scopes = 'user,repo'; // Define the permissions your app needs
    const redirectUri = encodeURIComponent(
      `http://localhost:3000/dev/github/oauth/callback`,
    ); // For local testing

    // In a deployed environment, you would use your actual deployed API Gateway URL:
    // const redirectUri = encodeURIComponent(`${this.configService.get<string>('API_GATEWAY_URL')}/dev/github/oauth/callback`);

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${this.GITHUB_CLIENT_ID}&scope=${scopes}&redirect_uri=${redirectUri}`;

    return res.redirect(githubAuthUrl);
  }

  /**
   * Handles the callback from GitHub after user authorization.
   * Exchanges the authorization code for an access token.
   * Access via: GET /dev/github/oauth/callback
   */
  @Get('oauth/callback')
  async githubCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      // Handle missing code, e.g., user denied access
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Authorization code not provided.');
    }

    try {
      const accessToken = await this.githubService.getAccessToken(code);
      // For simplicity, redirect to a success page showing the token.
      // In a real app, you'd likely create a session, set a cookie, or return JWT.
      return res.redirect(`/dev/github/success?token=${accessToken}`);
    } catch (error) {
      console.error('GitHub OAuth Callback Error:', error);
      // Redirect to an error page or render an error message
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * A simple success page to display the access token (for testing/debugging).
   * Access via: GET /dev/github/success?token=...
   */
  @Get('success')
  oauthSuccess(@Query('token') token: string) {
    return `<h1>GitHub OAuth Successful!</h1><p>Your Access Token: <code>${token}</code></p>
            <p><strong>Note:</strong> In a real application, you would handle this token securely (e.g., store in session, issue JWT, etc.) and not expose it directly in the URL or on a page like this.</p>
            <p>You can now use this token to test other GitHub API endpoints via your backend.</p>
            <p>Try: <a href="/dev/github/user?access_token=${token}">Get Authenticated User</a> (if you have a corresponding endpoint)</p>`;
  }

  /**
   * Example endpoint to get the authenticated user's profile.
   * Access via: GET /dev/github/user?access_token=...
   * Note: This exposes the access token in the URL, which is not recommended for production.
   * For production, you'd use a server-side session or JWT to manage the token.
   */
  @Get('user')
  async getAuthenticatedUser(@Query('access_token') accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException('Access token is required.');
    }
    return this.githubService.getAuthenticatedUser(accessToken);
  }

  /**
   * Example endpoint to get a public user's profile by username.
   * Access via: GET /dev/github/users/:username?access_token=... (optional)
   */
  @Get('users/:username')
  async getUserProfile(
    @Param('username') username: string,
    @Query('access_token') accessToken?: string,
  ) {
    return this.githubService.getUser(username, accessToken);
  }

  /**
   * Example endpoint to get a public repository details.
   * Access via: GET /dev/github/repos/:owner/:repo?access_token=... (optional)
   */
  @Get('repos/:owner/:repo')
  async getRepoDetails(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('access_token') accessToken?: string,
  ) {
    return this.githubService.getRepo(owner, repo, accessToken);
  }
}
