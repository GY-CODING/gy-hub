export interface ApiDoc {
  _id?: string;
  name: string;
  description: string;
  baseUrl: string;
  version?: string;
  endpoints?: Array<{
    method: string;
    path: string;
    description: string;
    parameters?: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
    responses?: Array<{
      status: number;
      description: string;
      schema?: unknown;
    }>;
  }>;
  authentication?: {
    type: string;
    description: string;
  };
}
