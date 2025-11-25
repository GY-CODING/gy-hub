export interface TextResponse {
  text: string;
}

export interface StructuredResponse<T = unknown> {
  type: string;
  data: T;
}

export type ApiResponse<T = unknown> = TextResponse | StructuredResponse<T>;
