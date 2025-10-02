import { SetMetadata } from "@nestjs/common";
import { PermissionEnum } from "../../permission/enum/permissions.enum";

export const HasPermissions = (...permissions: PermissionEnum[]) => SetMetadata("user:permissions", permissions);
