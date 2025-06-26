import { IsString } from 'class-validator';

/**
 * DTO for the response received from the GitHub OAuth access_token endpoint.
 * This represents the data exchanged after a successful OAuth authorization.
 */
export class GitHubAccessTokenResponseDto {
  /**
   * The access token provided by GitHub. This token is used to authenticate
   * subsequent API requests on behalf of the user.
   * @example "gho_16C7e42F292c6912E7710c838347Ae178B4a"
   */
  @IsString()
  access_token: string;

  /**
   * A comma-separated string indicating the scopes (permissions) granted
   * to the access token.
   * @example "repo,gist"
   */
  @IsString()
  scope: string;

  /**
   * The type of token returned. For GitHub OAuth, this is typically "bearer".
   * @example "bearer"
   */
  @IsString()
  token_type: string;
}
