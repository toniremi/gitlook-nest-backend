import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs'; // For converting Observables to Promises
import { GitHubUser } from './interfaces/github-user.interface';
import { GitHubApiErrorResponse } from './interfaces/github-error.interface';

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
  async getAuthenticatedUser(accessToken: string): Promise<GitHubUser> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<GitHubUser>('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const githubErrorData = error.response?.data as GitHubApiErrorResponse;
        const statusCode = error.response?.status; // Type: number | undefined

        const errorMessage =
          githubErrorData?.error_description ||
          githubErrorData?.error ||
          error.message;

        // NEW: Check if statusCode is a number before comparing
        if (typeof statusCode === 'number') {
          if (statusCode === 400 || statusCode === 401) {
            throw new UnauthorizedException(
              `Failed to exchange code for token: ${errorMessage}`,
            );
          } else if (statusCode >= 400 && statusCode < 500) {
            throw new BadRequestException(
              `GitHub token exchange client error: ${errorMessage}`,
            );
          } else {
            throw new InternalServerErrorException(
              `GitHub token exchange error: ${errorMessage}`,
            );
          }
        } else {
          // Handle cases where no HTTP status code was received (e.g., network issues)
          throw new InternalServerErrorException(
            `GitHub token exchange network error: ${errorMessage}`,
          );
        }
      } else if (error instanceof Error) {
        throw new InternalServerErrorException(
          `An unexpected error occurred during token exchange: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        `An unknown error occurred during token exchange: ${String(error)}`,
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
