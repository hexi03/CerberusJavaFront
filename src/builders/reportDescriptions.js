 
import { ReportType, ReportFieldType  } from './reportTypes.js';
import {  } from '../actions/departmentActions.js';
import { fetchAllWareHouseAction, fetchOneWareHouseAction } from '../actions/wareHouseActions.js';
import { fetchAllFactorySiteAction, fetchOneFactorySiteAction } from '../actions/factorySiteActions.js';
import { fetchAllItemsAction } from '../actions/itemActions.js';
import { fetchAllProductAction } from '../actions/productActions.js';
import { fetchOneReportAction, fetchReportsByQuery } from '../actions/reportActions.js';
import { reportFilter } from '../query/reportQuery.js';

export const reportDescriptions = {
  [ReportType.WH_INVENTARISATION]: {
    name: 'Отчет об инвентаризации',
    fetch:  (report) => {
        return [
             fetchOneWareHouseAction(report.wareHouseId),
             fetchAllItemsAction()
        ];
    },
    fetchCreate:  () => {
        return [
             fetchAllWareHouseAction(),
             fetchAllItemsAction()
        ];
    },
    fields: {
      wareHouseId: {
        label: 'Склад',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.wareHouse.wareHouses[report.wareHouseId],
        set: (builder, id, report, params) => builder.setWareHouseId(report.wareHouseId || params.get("locationSpecificId")),
        getVariants: (store, params) => Object.values(store.wareHouse.wareHouses)
      },
      items: {
        label: 'Учтенное',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).map((key) => ({item: store.item.items[key], amount: report.items[key]})),
        set: (builder, value, report, params) => builder.setItems(value.reduce((acc, val) => {acc[val.id] = val.amount; return acc;},{})),
        getVariants: (store, params) => Object.values(store.item.items)
      }
    }
  },
  [ReportType.WH_RELEASE]: {
    name: 'Отчет о снабжении',
    fetch:  (report) => {
      console.log("fetch called")
        return [
             fetchOneWareHouseAction(report.wareHouseId),
             fetchOneReportAction(report.supplyReqReportId),
             fetchAllItemsAction()
        ];
    },
    fetchCreate:  () => {
        return [
             fetchAllWareHouseAction(),
             fetchReportsByQuery({typeCriteria: ReportType.FS_SUP_REQ}),
             fetchAllItemsAction()
        ];
    },
    fields: {
      wareHouseId: {
        label: 'Склад',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.wareHouse.wareHouses[report.wareHouseId],
        set: (builder, id, report, params) => builder.setWareHouseId(report.wareHouseId || params.get("locationSpecificId")),
        getVariants: (store, params) => Object.values(store.wareHouse.wareHouses)
      },
      supplyReqReportId: {
        label: 'Отчет о запросе РМ',
        type: ReportFieldType.REP_SELECT,
        get: (store, report) => store.report.reports[report.supplyReqReportId],
        set: (builder, value, report, params) => builder.setSupReqReportId(value),
        getVariants: (store, params) => Object.values(reportFilter({typeCriteria: ReportType.FS_SUP_REQ, }, store.report.reports))
      },
      items: {
        label: 'Предоставленное',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).map((key) => ({item: store.item.items[key], amount: report.items[key]})),
        set: (builder, value, report, params) => builder.setItems(value.reduce((acc, val) => {acc[val.id] = val.amount; return acc;},{})),
        getVariants: (store, params) => Object.values(store.item.items)
      }
    }
  },
  [ReportType.WH_REPLENISHMENT]: {
    name: 'Отчет о приемке',
    fetch:  (report) => {
        return [
             fetchOneWareHouseAction(report.wareHouseId),
             fetchAllItemsAction()
        ];
    },
    fetchCreate:  () => {
        return [
             fetchAllWareHouseAction(),
             fetchAllItemsAction()
        ];
    },
    fields: {
      wareHouseId: {
        label: 'Склад',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.wareHouse.wareHouses[report.wareHouseId],
        set: (builder, id, report, params) => builder.setWareHouseId(report.wareHouseId || params.get("locationSpecificId")),
        getVariants: (store, params) => Object.values(store.wareHouse.wareHouses)
      },
      items: {
        label: 'Принятое',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).map((key) => ({item: store.item.items[key], amount: report.items[key]})),
        set: (builder, value, report, params) => builder.setItems(value.reduce((acc, val) => {acc[val.id] = val.amount; return acc;},{})),
        getVariants: (store, params) => Object.values(store.item.items)
      }
    }
  },
  [ReportType.WH_WS_REPLENISHMENT]: {
    name: 'Отчет о приемке результатов РС',
    fetch:  (report) => {
        return [
             fetchOneWareHouseAction(report.wareHouseId),
             fetchOneReportAction(report.workShiftReportId),
             fetchAllItemsAction()
        ];
    },
    fetchCreate:  () => {
        return [
             fetchAllWareHouseAction(),
             fetchReportsByQuery({typeCriteria: ReportType.FS_WORKSHIFT}),
             fetchAllItemsAction()
        ];
    },
    fields: {
      wareHouseId: {
        label: 'Склад',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.wareHouse.wareHouses[report.wareHouseId],
        set: (builder, id, report, params) => builder.setWareHouseId(report.wareHouseId || params.get("locationSpecificId")),
        getVariants: (store, params) => Object.values(store.wareHouse.wareHouses)
      },
      workShiftReportId: {
        label: 'Отчет о РС',
        type: ReportFieldType.REP_SELECT,
        get: (store, report) => store.report.reports[report.workShiftReportId],
        set: (builder, value, report, params) => builder.setWSReportId(value),
        getVariants: (store, params) => Object.values(reportFilter({typeCriteria: ReportType.FS_WORKSHIFT}, store.report.reports))
      },
      items: {
        label: 'Принятое',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).map((key) => ({item: store.item.items[key], amount: report.items[key]})),
        set: (builder, value, report, params) => builder.setItems(value.reduce((acc, val) => {acc[val.id] = val.amount; return acc;},{})),
        getVariants: (store, params) => Object.values(store.item.items)
      },
      unclaimedRemains: {
        label: 'Возвращенные РМ:',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.unclaimedRemains).includes(key)).map((key) => ({item: store.item.items[key], amount: report.unclaimedRemains[key]})),
        set: (builder, value, report, params) => builder.setUnclaimedRemains(value.reduce((acc, val) => {acc[val.id] = val.amount; return acc;},{})),
        getVariants: (store, params) => Object.values(store.item.items)
      }
    }
  },
  [ReportType.WH_SHIPMENT]: {
    name: 'Отчет об отгрузке',
    fetch:  (report) => {
        return [
             fetchOneWareHouseAction(report.wareHouseId),
             fetchAllItemsAction()
        ];
    },
    fetchCreate:  () => {
        return [
             fetchAllWareHouseAction(),
             fetchAllItemsAction()
        ];
    },
    fields: {
      wareHouseId: {
        label: 'Склад',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.wareHouse.wareHouses[report.wareHouseId],
        set: (builder, id, report, params) => builder.setWareHouseId(report.wareHouseId || params.get("locationSpecificId")),
        getVariants: (store, params) => Object.values(store.wareHouse.wareHouses)
      },
      items: {
        label: 'Отгруженное',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).map((key) => ({item: store.item.items[key], amount: report.items[key]})),
        set: (builder, value, report, params) => builder.setItems(value.reduce((acc, val) => {acc[val.id] = val.amount; return acc;},{})),
        getVariants: (store, params) => Object.values(store.item.items)
      }
    }
  },
  [ReportType.FS_SUP_REQ]: {
    name: 'Отчет о запросе снабжения',
    fetch:  (report) => {
        return [
             fetchOneFactorySiteAction(report.factorySiteId),
             fetchAllWareHouseAction(),
             fetchAllItemsAction()
        ];
    },
    fetchCreate:  () => {
        return [
            fetchAllFactorySiteAction(),
            fetchAllWareHouseAction(),
            fetchAllItemsAction()
        ];
    },
    fields: {
      factorySiteId: {
        label: 'Производственный участок',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.factorySite.factorySites[report.factorySiteId],
        set: (builder, id, report, params) => {builder.setFactorySiteId(report.factorySiteId || params.get("locationSpecificId"))},
        getVariants: (store, params) => Object.values(store.factorySite.factorySites)
      },
      targetWareHouseIds: {
        label: 'Заявленные целевые склады',
        type: ReportFieldType.WAREHOUSE_LIST,
        get: (store, report) => report.targetWareHouseIds.map((key) => store.wareHouse.wareHouses[key]),
        set: (builder, value, report, params) => builder.setTargetWareHouseIds(value),
        getVariants: (store, params) => Object.values(store.wareHouse.wareHouses)
      },
      items: {
        label: 'Запрошенное',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.items).includes(key)).map((key) => ({item: store.item.items[key], amount: report.items[key]})),
        set: (builder, value, report, params) => builder.setItems(value.reduce((acc, val) => {acc[val.id] = val.amount; return acc;},{})),
        getVariants: (store, params) => {console.log("inside Запрошенное: "); console.log(store.item.items); console.log(Object.values(store.item.items)); return Object.values(store.item.items)}
      }
    }
  },
  [ReportType.FS_WORKSHIFT]: {
    name: 'Отчет о результатах РС',
    fetch:  (report) => {
        return [
             fetchOneFactorySiteAction(report.factorySiteId),
             fetchAllWareHouseAction(),
             fetchAllItemsAction(),
             fetchAllProductAction()
        ];
    },
    fetchCreate:  () => {
        return [
            fetchAllFactorySiteAction(),
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
        set: (builder, id, report, params) => {builder.setFactorySiteId(report.factorySiteId || params.get("locationSpecificId"))},
        getVariants: (store, params) => Object.values(store.factorySite.factorySites)
      },
      targetWareHouseIds: {
        label: 'Заявленные целевые склады',
        type: ReportFieldType.WAREHOUSE_LIST,
        get: (store, report) => report.targetWareHouseIds.map((key) => store.wareHouse.wareHouses[key]),
        set: (builder, value, report, params) => builder.setTargetWareHouseIds(value),
        getVariants: (store, params) => Object.values(store.wareHouse.wareHouses)
      },
      produced: {
        label: 'Произведенное',
        type: ReportFieldType.PRODUCTS_LIST,
        get: (store, report) => Object.keys(store.product.products).filter(key => Object.keys(report.produced).includes(key)).map((key) => ({item: store.item.items[store.product.products[key].producedItemId], amount: report.produced[key], productId: key})),
        set: (builder, value, report, params) => builder.setProducedItems(value.reduce((acc, val) => {acc[val.id] = val.amount; return acc;},{})),
        getVariants: (store, params) => Object.values(store.product.products)?.map((key) => ({item: store.item.items[key.producedItemId], product: key}))
      },
      losses: {
        label: 'Потери',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.losses).includes(key)).map((key) => ({item: store.item.items[key], amount: report.losses[key]})),
        set: (builder, value, report, params) => builder.setLosses(value.reduce((acc, val) => {acc[val.id] = val.amount; return acc;},{})),
        getVariants: (store, params) => Object.values(store.item.items)
      },
      remains: {
        label: 'Остатки РМ',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => Object.keys(store.item.items).filter(key => Object.keys(report.remains).includes(key)).map((key) => ({item: store.item.items[key], amount: report.remains[key]})),
        set: (builder, value, report, params) => builder.setRemains(value.reduce((acc, val) => {acc[val.id] = val.amount; return acc;},{})),
        getVariants: (store, params) => Object.values(store.item.items)
      }
    }
  },
  // Define other report types similarly
};
