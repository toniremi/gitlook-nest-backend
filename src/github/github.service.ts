import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; // <-- REVISED: Import HttpService from @nestjs/axios
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs'; // For converting Observables to Promises

@Injectable()
export class GithubService {
  private readonly GITHUB_CLIENT_ID: string;
  private readonly GITHUB_CLIENT_SECRET: string;

  constructor(
    private readonly httpService: HttpService, // This HttpService now correctly comes from @nestjs/axios
    private readonly configService: ConfigService,
  ) {
    this.GITHUB_CLIENT_ID = this.configService.get<string>('GITHUB_CLIENT_ID')!;
    this.GITHUB_CLIENT_SECRET = this.configService.get<string>(
      'GITHUB_CLIENT_SECRET',
    )!;

    if (!this.GITHUB_CLIENT_ID || !this.GITHUB_CLIENT_SECRET) {
      throw new InternalServerErrorException(
        'GitHub Client ID or Secret not configured.',
      );
    }
  }

  /**
   * Exchanges an authorization code for an access token with GitHub.
   * @param code The authorization code received from GitHub.
   * @returns The access token string.
   */
  async getAccessToken(code: string): Promise<string> {
    const params = {
      client_id: this.GITHUB_CLIENT_ID,
      client_secret: this.GITHUB_CLIENT_SECRET,
      code,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://github.com/login/oauth/access_token',
          params,
          {
            headers: {
              Accept: 'application/json',
            },
          },
        ),
      );

      if (response.data && response.data.access_token) {
        return response.data.access_token;
      } else {
        console.error('GitHub access token error response:', response.data);
        throw new UnauthorizedException(
          `Failed to get access token: ${response.data.error_description || response.data.error || 'Unknown error'}`,
        );
      }
    } catch (error) {
      console.error(
        'Error exchanging code for access token:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        `Error exchanging code for access token: ${error.response?.data?.error_description || error.message}`,
      );
    }
  }

  /**
   * Fetches user data from GitHub using an access token.
   * @param accessToken The GitHub access token.
   * @returns User data from GitHub.
   */
  async getAuthenticatedUser(accessToken: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching authenticated user:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        `Error fetching authenticated user: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Fetches user details by username from GitHub.
   * @param username The GitHub username.
   * @param accessToken The GitHub access token (optional if user is public).
   * @returns User details from GitHub.
   */
  async getUser(username: string, accessToken?: string): Promise<any> {
    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `token ${accessToken}`;
      }
      const response = await firstValueFrom(
        this.httpService.get(`https://api.github.com/users/${username}`, {
          headers,
        }),
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching user ${username}:`,
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        `Error fetching user ${username}: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Fetches repository details from GitHub.
   * @param owner The repository owner's username.
   * @param repo The repository name.
   * @param accessToken The GitHub access token (optional if repo is public).
   * @returns Repository details from GitHub.
   */
  async getRepo(
    owner: string,
    repo: string,
    accessToken?: string,
  ): Promise<any> {
    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `token ${accessToken}`;
      }
      const response = await firstValueFrom(
        this.httpService.get(`https://api.github.com/repos/${owner}/${repo}`, {
          headers,
        }),
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching repo ${owner}/${repo}:`,
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        `Error fetching repo ${owner}/${repo}: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}
