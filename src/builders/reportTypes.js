export class ReportType{

    static WH_GENERIC = "warehouse_generic";
    static FS_GENERIC = "factorysite_generic";

    static WH_INVENTARISATION = "inventarisation"
    static WH_RELEASE = "release"
    static WH_REPLENISHMENT = "replenishment"
    static WH_WS_REPLENISHMENT = "workshiftreplenishment"
    static WH_SHIPMENT = "shipment"

    static FS_SUP_REQ = "supplyrequirement"
    static FS_WORKSHIFT = "workshift"

}


export class ReportFieldType {
  static NOT_ACCESSIBLE = 'NOT_ACCESSIBLE';
  static STRING = 'STRING';
  static DELETED_DATETIME = 'DELETED_DATETIME';
  static DATETIME = 'DATETIME';
  static WAREHOUSE_SELECT = 'WAREHOUSE_SELECT';
  static REP_SELECT = 'REP_SELECT';
  static ITEMS_LIST = 'ITEMS_LIST';
  static PRODUCTS_LIST = 'PRODUCTS_LIST';
  static ITEMS_LIST_VARIANTS = 'ITEMS_LIST_VARIANTS';
  static PRODUCTS_LIST_VARIANTS = 'PRODUCTS_LIST_VARIANTS';
}
