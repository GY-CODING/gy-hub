export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string;
  language: string;
  html_url: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  content: string;
  size: number;
}
