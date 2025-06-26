// src/github/interfaces/github-user.interface.ts
import { IsBoolean, IsDateString, IsEmail, IsInt, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PlanDto {
  @IsInt()
  collaborators: number;

  @IsString()
  name: string;

  @IsInt()
  space: number;

  @IsInt()
  private_repos: number;
}

export class PrivateUserDto {
  @IsString()
  login: string;

  @IsInt()
  id: number;

  @IsString()
  user_view_type: string;

  @IsString()
  node_id: string;

  @IsUrl()
  avatar_url: string;

  @IsOptional()
  @IsString()
  gravatar_id: string | null;

  @IsUrl()
  url: string;

  @IsUrl()
  html_url: string;

  @IsUrl()
  followers_url: string;

  @IsString()
  following_url: string;

  @IsString()
  gists_url: string;

  @IsString()
  starred_url: string;

  @IsUrl()
  subscriptions_url: string;

  @IsUrl()
  organizations_url: string;

  @IsUrl()
  repos_url: string;

  @IsString()
  events_url: string;

  @IsUrl()
  received_events_url: string;

  @IsString()
  type: string;

  @IsBoolean()
  site_admin: boolean;

  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @IsString()
  company: string | null;

  @IsOptional()
  @IsString()
  blog: string | null;

  @IsOptional()
  @IsString()
  location: string | null;

  @IsOptional()
  @IsEmail()
  email: string | null;

  @IsOptional()
  @IsEmail()
  notification_email: string | null;

  @IsOptional()
  @IsBoolean()
  hireable: boolean | null;

  @IsOptional()
  @IsString()
  bio: string | null;

  @IsOptional()
  @IsString()
  twitter_username: string | null;

  @IsInt()
  public_repos: number;

  @IsInt()
  public_gists: number;

  @IsInt()
  followers: number;

  @IsInt()
  following: number;

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;

  @IsInt()
  private_gists: number;

  @IsInt()
  total_private_repos: number;

  @IsInt()
  owned_private_repos: number;

  @IsInt()
  disk_usage: number;

  @IsInt()
  collaborators: number;

  @IsBoolean()
  two_factor_authentication: boolean;

  @ValidateNested()
  @Type(() => PlanDto)
  plan: PlanDto;

  @IsOptional()
  @IsBoolean()
  business_plus?: boolean;

  @IsOptional()
  @IsString()
  ldap_dn?: string;
}

export class PublicUserDto {
  @IsString()
  login: string;

  @IsInt()
  id: number;

  @IsString()
  user_view_type: string;

  @IsString()
  node_id: string;

  @IsUrl()
  avatar_url: string;

  @IsOptional()
  @IsString()
  gravatar_id: string | null;

  @IsUrl()
  url: string;

  @IsUrl()
  html_url: string;

  @IsUrl()
  followers_url: string;

  @IsString()
  following_url: string;

  @IsString()
  gists_url: string;

  @IsString()
  starred_url: string;

  @IsUrl()
  subscriptions_url: string;

  @IsUrl()
  organizations_url: string;

  @IsUrl()
  repos_url: string;

  @IsString()
  events_url: string;

  @IsUrl()
  received_events_url: string;

  @IsString()
  type: string;

  @IsBoolean()
  site_admin: boolean;

  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @IsString()
  company: string | null;

  @IsOptional()
  @IsString()
  blog: string | null;

  @IsOptional()
  @IsString()
  location: string | null;

  @IsOptional()
  @IsEmail()
  email: string | null;

  @IsOptional()
  @IsEmail()
  notification_email: string | null;

  @IsOptional()
  @IsBoolean()
  hireable: boolean | null;

  @IsOptional()
  @IsString()
  bio: string | null;

  @IsOptional()
  @IsString()
  twitter_username: string | null;

  @IsInt()
  public_repos: number;

  @IsInt()
  public_gists: number;

  @IsInt()
  followers: number;

  @IsInt()
  following: number;

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;

  @ValidateNested()
  @Type(() => PlanDto)
  plan: PlanDto;

  @IsOptional()
  @IsInt()
  private_gists?: number;

  @IsOptional()
  @IsInt()
  total_private_repos?: number;

  @IsOptional()
  @IsInt()
  owned_private_repos?: number;

  @IsOptional()
  @IsInt()
  disk_usage?: number;

  @IsOptional()
  @IsInt()
  collaborators?: number;
}

// Union type for the DTO. In your NestJS controller, you would likely receive
// this as a plain object and then validate/transform it.
export type UserDto = PrivateUserDto | PublicUserDto;
