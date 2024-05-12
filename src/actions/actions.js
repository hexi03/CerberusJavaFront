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


export const ERROR = "ERROR";
export const OK = "OK";


export const onErrorAction = (error) => ({
    action: ERROR,
    type: ERROR,
    scope: ERROR,
    error: error
});
