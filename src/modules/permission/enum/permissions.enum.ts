export enum PermissionEnum {
    OfferCreate = "OfferCreate",
    OfferUpdate = "OfferUpdate",
    OfferDelete = "OfferDelete",
    OfferSearch = "OfferSearch",

    CompanyFindAll = "CompanyFindAll",
    CompanyCreate = "CompanyCreate",

    CurrencyFindAll = "CurrencyFindAll",
    CurrencyCreate = "CurrencyCreate",

    PermissionsGetOne = "PermissionsGetOne",
    PermissionsGetMany = "PermissionsGetMany",

    ProbationaryPeriodCreate = "ProbationaryPeriodCreate",
    ProbationaryPeriodFindAll = "ProbationaryPeriodFindAll",

    RoleCreate = "RoleCreate",
    RoleUpdate = "RoleUpdate",
    RoleDelete = "RoleDelete",
    RoleGetOne = "RoleGetOne",
    RoleGetMany = "RoleGetMany",

    CreateUser = "CreateUser"
}

export const PermissionDescription: Record<PermissionEnum, string> = {
    [PermissionEnum.OfferCreate]: "Создание оффера",
    [PermissionEnum.OfferUpdate]: "Обновление оффера",
    [PermissionEnum.OfferDelete]: "Удаление оффера",
    [PermissionEnum.OfferSearch]: "Поиск оффера",

    [PermissionEnum.CompanyFindAll]: "Просмотр списка компаний",
    [PermissionEnum.CompanyCreate]: "Создание компании",

    [PermissionEnum.CurrencyFindAll]: "Просмотр списка валют",
    [PermissionEnum.CurrencyCreate]: "Создание валюты",

    [PermissionEnum.PermissionsGetOne]: "Просмотр одного разрешения",
    [PermissionEnum.PermissionsGetMany]: "Просмотр списка разрешений",

    [PermissionEnum.ProbationaryPeriodCreate]: "Создание испытательного срока",
    [PermissionEnum.ProbationaryPeriodFindAll]: "Просмотр списка испытательных сроков",

    [PermissionEnum.RoleCreate]: "Создание роли",
    [PermissionEnum.RoleUpdate]: "Обновление роли",
    [PermissionEnum.RoleDelete]: "Удаление роли",
    [PermissionEnum.RoleGetOne]: "Просмотр одной роли",
    [PermissionEnum.RoleGetMany]: "Просмотр списка ролей",

    [PermissionEnum.CreateUser]: "Создание пользователя"
};
