export enum PermissionEnum {
    SearchUser = "SearchUser",

    RoleCreate = "RoleCreate",
    RoleUpdate = "RoleUpdate",
    RoleDelete = "RoleDelete",
    RoleGetOne = "RoleGetOne",
    RoleGetMany = "RoleGetMany",

    CreateUser = "CreateUser",

    PermissionsGetMany = "PermissionsGetMany",
    PermissionsGetOne = "PermissionsGetOne",
}

export const PermissionDescription: Record<PermissionEnum, string> = {
    [PermissionEnum.RoleCreate]: "Создание роли",
    [PermissionEnum.RoleUpdate]: "Обновление роли",
    [PermissionEnum.RoleDelete]: "Удаление роли",
    [PermissionEnum.RoleGetOne]: "Просмотр одной роли",
    [PermissionEnum.RoleGetMany]: "Просмотр списка ролей",

    [PermissionEnum.CreateUser]: "Создание пользователя",
    [PermissionEnum.SearchUser]: "Поиск пользователя",

    [PermissionEnum.PermissionsGetMany]: "Просмотр списка прав",
    [PermissionEnum.PermissionsGetOne]: "Просмотр одного права"
};
