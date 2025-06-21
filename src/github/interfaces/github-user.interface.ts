// src/github/interfaces/github-user.interface.ts

export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null; // Can be null if not set
  company: string | null; // Can be null
  blog: string | null; // Can be null
  location: string | null; // Can be null
  email: string | null; // Can be null
  hireable: boolean | null; // Can be null
  bio: string | null; // Can be null
  twitter_username: string | null; // Can be null
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  // Add other fields as needed based on GitHub's API documentation
}
