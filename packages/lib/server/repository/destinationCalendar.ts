import type { Prisma } from "@prisma/client";

import { prisma } from "@calcom/prisma";

import { buildCredentialPayloadForPrisma } from "../buildCredentialPayloadForCalendar";

export class DestinationCalendarRepository {
  static async create(data: Prisma.DestinationCalendarCreateInput) {
    return await prisma.destinationCalendar.create({
      data,
    });
  }

  static async getByUserId(userId: number) {
    return await prisma.destinationCalendar.findFirst({
      where: {
        userId,
      },
    });
  }

  static async getByEventTypeId(eventTypeId: number) {
    return await prisma.destinationCalendar.findFirst({
      where: {
        eventTypeId,
      },
    });
  }

  static async find({ where }: { where: Prisma.DestinationCalendarWhereInput }) {
    return await prisma.destinationCalendar.findFirst({
      where,
    });
  }

  static async upsert({
    where,
    update,
    create,
  }: {
    where: Prisma.DestinationCalendarUpsertArgs["where"];
    update: {
      integration?: string;
      externalId?: string;
      credentialId?: number | null;
      primaryEmail?: string | null;
      delegationCredentialId?: string | null;
    };
    create: {
      integration: string;
      externalId: string;
      credentialId: number | null;
      primaryEmail?: string | null;
      delegationCredentialId?: string | null;
    };
  }) {
    const credentialPayloadForUpdate = buildCredentialPayloadForPrisma({
      credentialId: update.credentialId,
      delegationCredentialId: update.delegationCredentialId,
    });

    const credentialPayloadForCreate = buildCredentialPayloadForPrisma({
      credentialId: create.credentialId,
      delegationCredentialId: create.delegationCredentialId,
    });

    return await prisma.destinationCalendar.upsert({
      where,
      update: {
        ...update,
        ...credentialPayloadForUpdate,
      },
      create: {
        ...create,
        ...credentialPayloadForCreate,
      },
    });
  }
}
