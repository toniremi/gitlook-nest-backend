import { IsBoolean, IsString, IsInt, IsUrl, IsDateString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// --- Nested DTOs ---

/**
 * DTO for the `license` object found within a GitHub Repository.
 */
export class LicenseDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString() // Can be null if no SPDX ID
  spdx_id: string | null;

  @IsOptional()
  @IsUrl() // Can be null if no URL
  url: string | null;

  @IsString()
  node_id: string;

  @IsOptional()
  @IsUrl() // Optional, sometimes present
  html_url?: string;
}

/**
 * DTO for the `permissions` object found within a GitHub Repository.
 * Indicates the authenticated user's permissions on the repository.
 */
export class PermissionsDto {
  @IsBoolean()
  admin: boolean;

  @IsBoolean()
  push: boolean;

  @IsBoolean()
  pull: boolean;
}

/**
 * DTO for a simplified user object, typically used for owners, organizations, etc.,
 * within other GitHub API responses where full private user details are not exposed.
 * This is a subset of the `PublicUserDto` properties.
 */
export class SimpleUserDto {
  @IsString()
  login: string;

  @IsInt()
  id: number;

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

  @IsString() // Note: {/other_user} template in URL
  following_url: string;

  @IsString() // Note: {/gist_id} template in URL
  gists_url: string;

  @IsString() // Note: {/owner}{/repo} template in URL
  starred_url: string;

  @IsUrl()
  subscriptions_url: string;

  @IsUrl()
  organizations_url: string;

  @IsUrl()
  repos_url: string;

  @IsString() // Note: {/privacy} template in URL
  events_url: string;

  @IsUrl()
  received_events_url: string;

  @IsString()
  type: string; // e.g., "User", "Organization"

  @IsBoolean()
  site_admin: boolean;
}

/**
 * DTO for the status of specific security and analysis features.
 */
export class SecurityFeatureStatusDto {
  @IsString()
  status: 'enabled' | 'disabled';
}

/**
 * DTO for the `security_and_analysis` object.
 * Provides details about advanced security features for the repository.
 */
export class SecurityAndAnalysisDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => SecurityFeatureStatusDto)
  advanced_security?: SecurityFeatureStatusDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SecurityFeatureStatusDto)
  secret_scanning?: SecurityFeatureStatusDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SecurityFeatureStatusDto)
  secret_scanning_push_protection?: SecurityFeatureStatusDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SecurityFeatureStatusDto)
  secret_scanning_non_provider_patterns?: SecurityFeatureStatusDto;
}

// Forward Declaration for self-referencing DTOs (like parent/source/template_repository)
// This is necessary to avoid circular dependency errors in TypeScript
// if a RepositoryDto directly referenced itself without being fully defined first.
export class MinimalRepositoryDto {}

/**
 * DTO for the main GitHub Repository object.
 * Represents a repository returned by the /repos/{owner}/{repo} endpoint.
 */
export class RepositoryDto {
  @IsInt()
  id: number;

  @IsString()
  node_id: string;

  @IsString()
  name: string;

  @IsString()
  full_name: string;

  @ValidateNested()
  @Type(() => SimpleUserDto)
  owner: SimpleUserDto;

  @IsBoolean()
  private: boolean;

  @IsUrl()
  html_url: string;

  @IsOptional()
  @IsString()
  description: string | null; // Can be null

  @IsBoolean()
  fork: boolean;

  @IsUrl()
  url: string;

  @IsString() // Template URL
  archive_url: string;

  @IsString() // Template URL
  assignees_url: string;

  @IsString() // Template URL
  blobs_url: string;

  @IsString() // Template URL
  branches_url: string;

  @IsString() // Template URL
  collaborators_url: string;

  @IsString() // Template URL
  comments_url: string;

  @IsString() // Template URL
  commits_url: string;

  @IsString() // Template URL
  compare_url: string;

  @IsString() // Template URL
  contents_url: string;

  @IsUrl()
  contributors_url: string;

  @IsUrl()
  deployments_url: string;

  @IsUrl()
  downloads_url: string;

  @IsUrl()
  events_url: string;

  @IsUrl()
  forks_url: string;

  @IsString() // Template URL
  git_commits_url: string;

  @IsString() // Template URL
  git_refs_url: string;

  @IsString() // Template URL
  git_tags_url: string;

  @IsString()
  git_url: string;

  @IsString() // Template URL
  issue_comment_url: string;

  @IsString() // Template URL
  issue_events_url: string;

  @IsString() // Template URL
  issues_url: string;

  @IsString() // Template URL
  keys_url: string;

  @IsString() // Template URL
  labels_url: string;

  @IsUrl()
  languages_url: string;

  @IsUrl()
  merges_url: string;

  @IsString() // Template URL
  milestones_url: string;

  @IsString() // Template URL (with query params)
  notifications_url: string;

  @IsString() // Template URL
  pulls_url: string;

  @IsString() // Template URL
  releases_url: string;

  @IsString()
  ssh_url: string;

  @IsUrl()
  stargazers_url: string;

  @IsString() // Template URL
  statuses_url: string;

  @IsUrl()
  subscribers_url: string;

  @IsUrl()
  subscription_url: string;

  @IsUrl()
  tags_url: string;

  @IsUrl()
  teams_url: string;

  @IsString() // Template URL
  trees_url: string;

  @IsUrl()
  clone_url: string;

  @IsOptional()
  @IsString() // Can be null
  mirror_url: string | null;

  @IsUrl()
  hooks_url: string;

  @IsUrl()
  svn_url: string;

  @IsOptional()
  @IsString() // Can be null
  homepage: string | null;

  @IsInt()
  forks_count: number;

  @IsInt()
  forks: number; // Duplicate of forks_count in the example

  @IsInt()
  stargazers_count: number;

  @IsInt()
  watchers_count: number;

  @IsInt()
  watchers: number; // Duplicate of watchers_count in the example

  @IsInt()
  size: number; // Size of the repository in KB

  @IsString()
  default_branch: string;

  @IsInt()
  open_issues_count: number;

  @IsInt()
  open_issues: number; // Duplicate of open_issues_count in the example

  @IsBoolean()
  is_template: boolean;

  @IsArray()
  @IsString({ each: true })
  topics: string[];

  @IsBoolean()
  has_issues: boolean;

  @IsBoolean()
  has_projects: boolean;

  @IsBoolean()
  has_wiki: boolean;

  @IsBoolean()
  has_pages: boolean;

  @IsBoolean()
  has_downloads: boolean;

  @IsBoolean()
  has_discussions: boolean;

  @IsBoolean()
  archived: boolean;

  @IsBoolean()
  disabled: boolean;

  @IsString()
  visibility: string; // e.g., "public", "private", "internal"

  @IsDateString()
  pushed_at: string;

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;

  @ValidateNested()
  @Type(() => PermissionsDto)
  permissions: PermissionsDto;

  @IsBoolean()
  allow_rebase_merge: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => RepositoryDto) // Recursively reference RepositoryDto for template_repository
  template_repository?: RepositoryDto | null; // Can be null

  @IsOptional()
  @IsString()
  temp_clone_token?: string; // Appears only in template_repository

  @IsBoolean()
  allow_squash_merge: boolean;

  @IsBoolean()
  allow_auto_merge: boolean;

  @IsBoolean()
  delete_branch_on_merge: boolean;

  @IsBoolean()
  allow_merge_commit: boolean;

  @IsBoolean()
  allow_forking: boolean; // Not present in example, but common. Marking as optional.

  @IsInt()
  subscribers_count: number;

  @IsInt()
  network_count: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LicenseDto)
  license: LicenseDto | null; // Can be null

  @IsOptional()
  @ValidateNested()
  @Type(() => SimpleUserDto) // Organization object is similar to SimpleUserDto
  organization?: SimpleUserDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => RepositoryDto) // Recursively reference RepositoryDto for parent
  parent?: RepositoryDto; // Only present if it's a fork

  @IsOptional()
  @ValidateNested()
  @Type(() => RepositoryDto) // Recursively reference RepositoryDto for source
  source?: RepositoryDto; // Only present if it's a fork

  @IsOptional()
  @IsString()
  language: string | null; // Can be null, e.g., if a repo has no language files

  @IsOptional()
  @ValidateNested()
  @Type(() => SecurityAndAnalysisDto)
  security_and_analysis?: SecurityAndAnalysisDto;
}

// Re-assign MinimalRepositoryDto to be identical to RepositoryDto for the sake of simplicity
// as the example provided for template_repository, parent, and source actually contains
// a full repository object. If a truly 'minimal' representation was needed,
// this class would contain only a subset of RepositoryDto's properties.
Object.assign(MinimalRepositoryDto.prototype, RepositoryDto.prototype);
