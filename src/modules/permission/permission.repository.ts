import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PermissionBaseDto } from "./dto/base.dto";

@Injectable()
export class PermissionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(query?: string): Promise<PermissionBaseDto[]> {
        return this.prisma.permission.findMany({
            where: query
                ? {
                      OR: [
                          {
                              name: {
                                  mode: "insensitive",
                                  contains: query
                              }
                          },
                          {
                              description: {
                                  mode: "insensitive",
                                  contains: query
                              }
                          }
                      ]
                  }
                : {}
        });
    }

    async findOne(id: number): Promise<PermissionBaseDto | null> {
        return this.prisma.permission.findUnique({ where: { id } });
    }
}
