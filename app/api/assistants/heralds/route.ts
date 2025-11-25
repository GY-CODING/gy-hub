import { NextRequest } from "next/server";
import { ERROR_MESSAGES } from "../shared/constants";
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "../shared/utils/request.utils";
import { HeraldsService } from "./service";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await validateRequest(req);

    const service = new HeraldsService();
    const text = await service.generateResponse(prompt);

    return createSuccessResponse({ text });
  } catch (error) {
    console.error("Heralds API error:", error);

    const message =
      error instanceof Error ? error.message : ERROR_MESSAGES.GENERATION_FAILED;
    return createErrorResponse(message, 500);
  }
}
