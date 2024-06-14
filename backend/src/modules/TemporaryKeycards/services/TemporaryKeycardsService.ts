import { Injectable } from "@nestjs/common";
import { eq, and, gte, lte, sql} from 'drizzle-orm';
import { temporaryKeycards } from '$backend/schema';
import { DrizzleDatabase } from "$backend/modules/Sources/services";

@Injectable()
export class TemporaryKeycardsService {
  constructor(private readonly database: DrizzleDatabase) {}

  async getKeycardsByType(
    type: 'temporary' | 'one-time',
    startDate?: string,
    endDate?: string
) {
    const start = startDate ? new Date(startDate) : new Date(0); // default to epoch start if not provided
    const end = endDate ? new Date(endDate) : new Date();

    return this.database.getInstance()
        .select()
        .from(temporaryKeycards)
        .where((card) => {
            const expiresAt = new Date(card.expiresAt as unknown as string);
            const createdAt = new Date(card.createdAt as unknown as string);
            const isOneTime = (expiresAt.getTime() - createdAt.getTime()) <= 2 * 24 * 60 * 60 * 1000;

            if (type === 'one-time' && isOneTime) {
                return and(
                    gte(card.createdAt, start.toISOString()),
                    lte(card.createdAt, end.toISOString())
                );
            }

            if (type === 'temporary' && !isOneTime) {
                return and(
                    gte(card.createdAt, start.toISOString()),
                    lte(card.createdAt, end.toISOString())
                );
            }

            // If the condition is not met, return a false SQL condition
            return sql`1 = 0`;
        });
      }
    }