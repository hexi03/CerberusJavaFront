 
import { ReportType, ReportFieldType  } from './reportTypes.js';
import {  } from '../actions/departmentActions.js';
import { fetchAllWareHouseAction, fetchOneWareHouseAction } from '../actions/wareHouseActions.js';
import { fetchOneFactorySiteAction } from '../actions/factorySiteActions.js';
import { fetchAllItemsAction } from '../actions/itemActions.js';
import { fetchAllProductAction } from '../actions/productActions.js';
import { fetchOneReportAction } from '../actions/reportActions.js';
import { reportFilter } from '../query/reportQuery.js';

export const reportDescriptions = {
  [ReportType.WH_INVENTARISATION]: {
    name: 'Warehouse Inventarisation Report',
    fetch:  (report) => {
        return [
             fetchOneWareHouseAction(report.wareHouseId),
             fetchAllItemsAction()
        ];
    },
    fields: {
      wareHouseId: {
        label: 'Склад',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.wareHouse.wareHouses[report.wareHouseId],
        set: (builder, id) => builder.setId(id),
        getVariants: (store) => store.wareHouse.wareHouses
      },
      items: {
        label: 'Учтенное',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).reduce((acc,key) => {acc[key] = {item: store.item.items[key], amount: report.items[key]}; return acc},{}),
        set: (builder, value) => builder.setItems(value),
        getVariants: (store) => Object.keys(store.item.items).map(key => ({ id: key, name: store.item.items[key].name }))
      }
    }
  },
  [ReportType.WH_RELEASE]: {
    name: 'Warehouse Release Report',
    fetch:  (report) => {
      console.log("fetch called")
        return [
             fetchOneWareHouseAction(report.wareHouseId),
             fetchOneReportAction(report.supReqReportId),
             fetchAllItemsAction()
        ];
    },
    fields: {
      wareHouseId: {
        label: 'Склад',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.wareHouse.wareHouses[report.wareHouseId],
        set: (builder, value) => builder.setWareHouseId(value),
        getVariants: (store) => store.wareHouse.wareHouses
      },
      supReqReportId: {
        label: 'Отчет о запросе РМ',
        type: ReportFieldType.REP_SELECT,
        get: (store, report) => store.report.reports[report.supReqReportId],
        set: (builder, value) => builder.setWSReportId(value),
        getVariants: (store) => reportFilter({typeCriteria: ReportType.FS_SUP_REQ}, store.report.reports)
      },
      items: {
        label: 'Предоставленное',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).reduce((acc,key) => {acc[key] = {item: store.item.items[key], amount: report.items[key]}; return acc},{}),
        set: (builder, value) => builder.setItems(value),
        getVariants: (store) => Object.keys(store.item.items).map(key => ({ id: key, name: store.item.items[key].name }))
      }
    }
  },
  [ReportType.WH_REPLENISHMENT]: {
    name: 'Warehouse Replenishment Report',
    fetch:  (report) => {
        return [
             fetchOneWareHouseAction(report.wareHouseId),
             fetchAllItemsAction()
        ];
    },
    fields: {
      wareHouseId: {
        label: 'Склад',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.wareHouse.wareHouses[report.wareHouseId],
        set: (builder, value) => builder.setWareHouseId(value),
        getVariants: (store) => store.wareHouse.wareHouses
      },
      items: {
        label: 'Принятое',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).reduce((acc,key) => {acc[key] = {item: store.item.items[key], amount: report.items[key]}; return acc},{}),
        set: (builder, value) => builder.setItems(value),
        getVariants: (store) => Object.keys(store.item.items).map(key => ({ id: key, name: store.item.items[key].name }))
      }
    }
  },
  [ReportType.WH_WS_REPLENISHMENT]: {
    name: 'Warehouse Workshift Replenishment Report',
    fetch:  (report) => {
        return [
             fetchOneWareHouseAction(report.wareHouseId),
             fetchOneReportAction(report.workShiftReportId),
             fetchAllItemsAction()
        ];
    },
    fields: {
      wareHouseId: {
        label: 'Склад',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.wareHouse.wareHouses[report.wareHouseId],
        set: (builder, value) => builder.setWareHouseId(value),
        getVariants: (store) => store.wareHouse.wareHouses
      },
      workShiftReportId: {
        label: 'Отчет о рабочей смене',
        type: ReportFieldType.REP_SELECT,
        get: (store, report) => store.report.reports[report.workShiftReportId],
        set: (builder, value) => builder.setWSReportId(value),
        getVariants: (store) => reportFilter({typeCriteria: ReportType.FS_WORKSHIFT}, store.report.reports)
      },
      items: {
        label: 'Принятое',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).reduce((acc,key) => {acc[key] = {item: store.item.items[key], amount: report.items[key]}; return acc},{}),
        set: (builder, value) => builder.setItems(value),
        getVariants: (store) => Object.keys(store.item.items).map(key => ({ id: key, name: store.item.items[key].name }))
      },
      items: {
        label: 'Возвращенные РМ:',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.unclaimedRemains).includes(key)).reduce((acc,key) => {acc[key] = {item: store.item.items[key], amount: report.unclaimedRemains[key]}; return acc},{}),
        set: (builder, value) => builder.setUnclaimedRemains(value),
        getVariants: (store) => Object.keys(store.item.items).map(key => ({ id: key, name: store.item.items[key].name }))
      }
    }
  },
  [ReportType.WH_SHIPMENT]: {
    name: 'Warehouse Shipment Report',
    fetch:  (report) => {
        return [
             fetchOneWareHouseAction(report.wareHouseId),
             fetchAllItemsAction()
        ];
    },
    fields: {
      wareHouseId: {
        label: 'Склад',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.wareHouse.wareHouses[report.wareHouseId],
        set: (builder, value) => builder.setWareHouseId(value),
        getVariants: (store) => store.wareHouse.wareHouses
      },
      items: {
        label: 'Отгруженное',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).reduce((acc,key) => {acc[key] = {item: store.item.items[key], amount: report.items[key]}; return acc},{}),
        set: (builder, value) => builder.setItems(value),
        getVariants: (store) => Object.keys(store.item.items).map(key => ({ id: key, name: store.item.items[key].name }))
      }
    }
  },
  [ReportType.FS_SUP_REQ]: {
    name: 'Factory Site Supply Requirement Report',
    fetch:  (report) => {
        return [
             fetchOneFactorySiteAction(report.factorySiteId),
             fetchAllWareHouseAction(),
             fetchAllItemsAction()
        ];
    },
    fields: {
      factorySiteId: {
        label: 'Производственный участок',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.factorySite.factorySites[report.factorySiteId],
        set: (builder, value) => builder.setFactorySiteId(value),
        getVariants: (store) => store.factorySite.factorySites
      },
      targetWareHouseIds: {
        label: 'Заявленные целевые склады',
        type: ReportFieldType.WAREHOUSE_LIST,
        get: (store, report) => report.targetWareHouseIds.map((key) => store.wareHouse.wareHouses[key]),
        set: (builder, value) => builder.setSetTargetWareHouseIds(value),
        getVariants: (store) => store.wareHouse.wareHouses
      },
      items: {
        label: 'Запрошенное',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).reduce((acc,key) => {acc[key] = {item: store.item.items[key], amount: report.items[key]}; return acc},{}),
        set: (builder, value) => builder.setItems(value),
        getVariants: (store) => Object.keys(store.item.items).map(key => ({ id: key, name: store.item.items[key].name }))
      }
    }
  },
  [ReportType.FS_WORKSHIFT]: {
    name: 'Factory Site Workshift Report',
    fetch:  (report) => {
        return [
             fetchOneFactorySiteAction(report.factorySiteId),
             fetchAllWareHouseAction(),
             fetchAllItemsAction(),
             fetchAllProductAction()
        ];
    },
    fields: {
      factorySiteId: {
        label: 'Производственный участок',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.factorySite.factorySites[report.factorySiteId],
        set: (builder, value) => builder.setFactorySiteId(value),
        getVariants: (store) => store.factorySite.factorySites
      },
      targetWareHouseIds: {
        label: 'Заявленные целевые склады',
        type: ReportFieldType.WAREHOUSE_LIST,
        get: (store, report) => report.targetWareHouseIds.map((key) => store.wareHouse.wareHouses[key]),
        set: (builder, value) => builder.setSetTargetWareHouseIds(value),
        getVariants: (store) => store.wareHouse.wareHouses
      },
      produced: {
        label: 'Произведенное',
        type: ReportFieldType.PRODUCTS_LIST,
        get: (store, report) => Object.keys(store.product.products).filter(key => Object.keys(report.produced).includes(key)).reduce((acc,key) => {acc[key] = {product: store.product.products[key], amount: report.produced[key]}; return acc},{}),
        set: (builder, value) => builder.setItems(value),
        getVariants: (store) =>Object.keys(store.product.products).map(key => ({ id: key, name: store.item.items[store.product.products[key].producedItemId].name }))
      },
      losses: {
        label: 'Потери',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.losses).includes(key)).reduce((acc,key) => {acc[key] = {item: store.item.items[key], amount: report.losses[key]}; return acc},{}),
        set: (builder, value) => builder.setLosses(value),
        getVariants: (store) => Object.keys(store.item.items).map(key => ({ id: key.id, name: store.item.items[key].name }))
      },
      remains: {
        label: 'Остатки РМ',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.remains).includes(key)).reduce((acc,key) => {acc[key] = {item: store.item.items[key], amount: report.remains[key]}; return acc},{}),
        set: (builder, value) => builder.setRemains(value),
        getVariants: (store) => Object.keys(store.item.items).map(key => ({ id: key, name: store.item.items[key].name }))
      }
    }
  },
  // Define other report types similarly
};
