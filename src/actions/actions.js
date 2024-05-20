export const FETCHALL = "FETCHALL";
export const FETCHONE = "FETCHONE";

export const FETCHNOTFOUND = "FETCHNOTFOUND";

export const CREATE = "CREATE";
export const UPDATE = "UPDATE";
export const UPDATESUPPLY = "UPDATESUPPLY";
export const DELETE = "DELETE";


export const DEPARTMENT = "DEPARTMENT";
export const FACTORYSITE = "FACTORYSITE";
export const WAREHOUSE = "WAREHOUSE";
export const PRODUCT = "PRODUCT";
export const ITEM = "ITEM";
export const GROUP = "GROUP";
export const USER = "USER";
export const REPORT = "REPORT";


export const FACTORYSITESTATE = "FACTORYSITESTATE";
export const WAREHOUSESTATE = "WAREHOUSESTATE";

export const ERROR = "ERROR";
export const OK = "OK";


export const onErrorAction = (error) => ({
    action: ERROR,
    type: ERROR,
    scope: ERROR,
    error: error
});
