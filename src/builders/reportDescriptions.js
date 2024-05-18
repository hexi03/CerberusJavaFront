 
import { ReportType, ReportFieldType  } from './reportTypes.js';
import {  } from '../actions/departmentActions.js';
import { fetchAllWareHouseAction, fetchOneWareHouseAction } from '../actions/wareHouseActions.js';
import {  } from '../actions/factorySiteActions.js';
import { fetchAllItemsAction } from '../actions/itemActions.js';
import {  } from '../actions/productActions.js';
import { fetchOneReportAction } from '../actions/reportActions.js';

export const reportDescriptions = {
  [ReportType.WH_INVENTARISATION]: {
    name: 'Warehouse Inventarisation Report',
    fetch: (report) => {
        fetchOneWareHouseAction(report.wareHouseId);
        fetchAllItemsAction();
      },
    fields: {
      wareHouseId: {
        label: 'Warehouse ID',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.warehouses.find(w => w.id === report.wareHouseId),
        set: (builder, id) => builder.setId(id),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      },
      items: {
        label: 'Items',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => store.items.filter(item => report.items.includes(item.id)),
        set: (builder, value) => builder.setItems(value.map(item => item.id)),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      }
    }
  },
  [ReportType.WH_RELEASE]: {
    name: 'Warehouse Release Report',
    fetch: (report) => {

        fetchOneWareHouseAction(report.wareHouseId);
        fetchOneReportAction(report.supReqReportId)
        fetchAllItemsAction();
    },
    fields: {
      wareHouseId: {
        label: 'Warehouse ID',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.warehouses.find(w => w.id === report.wareHouseId),
        set: (builder, value) => builder.setId(value),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      },
      supReqReportId: {
        label: 'Supply Requirement Report ID',
        type: ReportFieldType.SUP_REQ_REP_SELECT,
        get: (store, report) => store.supReqReports.find(r => r.id === report.supReqReportId),
        set: (builder, value) => builder.setWSReportId(value),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      },
      items: {
        label: 'Items',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => store.items.filter(item => report.items.includes(item.id)),
        set: (builder, value) => builder.setItems(value.map(item => item.id)),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      }
    }
  },
  [ReportType.WH_REPLENISHMENT]: {
    name: 'Warehouse Replenishment Report',
    fetch: (report) => {
        fetchOneWareHouseAction(report.wareHouseId);
        fetchAllItemsAction();
    },
    fields: {
      wareHouseId: {
        label: 'Warehouse ID',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.warehouses.find(w => w.id === report.wareHouseId),
        set: (builder, value) => builder.setId(value),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      },
      items: {
        label: 'Items',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => store.items.filter(item => report.items.includes(item.id)),
        set: (builder, value) => builder.setItems(value.map(item => item.id)),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      }
    }
  },
  [ReportType.WH_WS_REPLENISHMENT]: {
    name: 'Warehouse Workshift Replenishment Report',
    fetch: (report) => {
        fetchOneWareHouseAction(report.wareHouseId);
        fetchOneReportAction(report.workShiftReportId)
        fetchAllItemsAction();
    },
    fields: {
      wareHouseId: {
        label: 'Warehouse ID',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.warehouses.find(w => w.id === report.wareHouseId),
        set: (builder, value) => builder.setId(value),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      },
      workShiftReportId: {
        label: 'Workshift Report ID',
        type: ReportFieldType.WS_REP_SELECT,
        get: (store, report) => store.workshiftReports.find(r => r.id === report.workShiftReportId),
        set: (builder, value) => builder.setWSReportId(value),
        getVariants: (store) => store.workshiftReports.map(report => ({ id: report.id, label: report.name }))
      },
      items: {
        label: 'Items',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => store.items.filter(item => report.items.includes(item.id)),
        set: (builder, value) => builder.setItems(value.map(item => item.id)),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      }
    }
  },
  [ReportType.WH_SHIPMENT]: {
    name: 'Warehouse Shipment Report',
    fetch: (report) => {
        fetchOneWareHouseAction(report.wareHouseId);
        fetchAllItemsAction();
    },
    fields: {
      wareHouseId: {
        label: 'Warehouse ID',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.warehouses.find(w => w.id === report.wareHouseId),
        set: (builder, value) => builder.setId(value),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      },
      items: {
        label: 'Items',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => store.items.filter(item => report.items.includes(item.id)),
        set: (builder, value) => builder.setItems(value.map(item => item.id)),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      }
    }
  },
  [ReportType.FS_SUP_REQ]: {
    name: 'Factory Site Supply Requirement Report',
    fetch: (report) => {
        fetchOneFactorySiteAction(report.factorySiteId);
        fetchAllWareHouseAction();
        fetchAllItemsAction();
    },
    fields: {
      factorySiteId: {
        label: 'Factory Site ID',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.factorySites.find(f => f.id === report.factorySiteId),
        set: (builder, value) => builder.setId(value),
        getVariants: (store) => store.factorySites.map(factorySite => ({ id: factorySite.id, label: factorySite.name }))
      },
      targetWareHouseIds: {
        label: 'Target Warehouse IDs',
        type: ReportFieldType.WAREHOUSE_SELECT,
        get: (store, report) => report.targetWareHouseIds.map(id => store.warehouses.find(w => w.id === id)),
        set: (builder, value) => builder.setSetTargetWareHouseIds(value.map(w => w.id)),
        getVariants: (store) => store.warehouses.map(warehouse => ({ id: warehouse.id, label: warehouse.name }))
      },
      items: {
        label: 'Items',
        type: ReportFieldType.ITEMS_LIST,
        get: (store, report) => store.items.filter(item => report.items.includes(item.id)),
        set: (builder, value) => builder.setItems(value.map(item => item.id)),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      }
    }
  },
  [ReportType.FS_WORKSHIFT]: {
    name: 'Factory Site Workshift Report',
    fetch: (report) => {
        fetchOneFactorySiteAction(report.factorySiteId);
        fetchAllWareHouseAction();
        fetchAllItemsAction();
    },
    fields: {
      factorySiteId: {
        label: 'Factory Site ID',
        type: ReportFieldType.NOT_ACCESSIBLE,
        get: (store, report) => store.factorySites.find(f => f.id === report.factorySiteId),
        set: (builder, value) => builder.setId(value),
        getVariants: (store) => store.factorySites.map(factorySite => ({ id: factorySite.id, label: factorySite.name }))
      },
      targetWareHouseIds: {
        label: 'Target Warehouse IDs',
        type: ReportFieldType.WAREHOUSE_SELECT,
        get: (store, report) => report.targetWareHouseIds.map(id => store.warehouses.find(w => w.id === id)),
        set: (builder, value) => builder.setSetTargetWareHouseIds(value.map(w => w.id)),
        getVariants: (store) => store.warehouses.map(warehouse => ({ id: warehouse.id, label: warehouse.name }))
      },
      produced: {
        label: 'Produced',
        type: ReportFieldType.ITEMS_LIST_LIMITED,
        get: (store, report) => store.items.filter(item => report.produced.includes(item.id)),
        set: (builder, value) => builder.setItems(value.map(item => item.id)),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      },
      losses: {
        label: 'Losses',
        type: ReportFieldType.ITEMS_LIST_LIMITED,
        get: (store, report) => store.items.filter(item => report.losses.includes(item.id)),
        set: (builder, value) => builder.setLosses(value.map(item => item.id)),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      },
      remains: {
        label: 'Remains',
        type: ReportFieldType.ITEMS_LIST_LIMITED,
        get: (store, report) => store.items.filter(item => report.remains.includes(item.id)),
        set: (builder, value) => builder.setRemains(value.map(item => item.id)),
        getVariants: (store) => store.items.map(item => ({ id: item.id, label: item.name }))
      }
    }
  },
  // Define other report types similarly
};
