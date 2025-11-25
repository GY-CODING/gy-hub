export interface AssistantRequest {
  prompt: string;
  topic?: string;
}

export interface AssistantResponse {
  text?: string;
  type?: string;
  [key: string]: unknown;
}

export interface AssistantConfig {
  model: string;
  systemPrompt: string;
}

export interface AssistantError {
  error: string;
  code?: string;
}
