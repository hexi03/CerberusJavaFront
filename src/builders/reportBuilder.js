import {ReportType} from "reportTypes.js";
 export class ReportBuilder {

    constructor() {
    }

    setType(type){
        switch (type){
            case ReportType.WH_INVENTARISATION:
                return new InventarisationReportSubBuilder();
            case ReportType.WH_RELEASE:
                return new ReleaseReportSubBuilder();
            case ReportType.WH_REPLENISHMENT:
                return new ReplenishmentReportSubBuilder();
            case ReportType.WH_WS_REPLENISHMENT:
                return new WSReplenishmentReportSubBuilder();
            case ReportType.WH_SHIPMENT:
                return new ShipmentReportSubBuilder();
            case ReportType.FS_SUP_REQ:
                return new SupplyRequirementReportSubBuilder();
            case ReportType.FS_WORKSHIFT:
                return new WorkShiftReportSubBuilder();
            default:
                throw new Error("Invalid report type");
        }
    }

}

class GenericReportSubBuilder{
    constructor(){
        this.id = null;
        this.createdAt = null;
        this.deletedAt = null;

    }

    setId(id){
        this.id = id;
    }

    setCreatedAt(createdAt){
        this.createdAt = createdAt;
    }

    setDeletedAt(deletedAt){
        this.deletedAt = deletedAt;
    }

    build(){
        return {
            id: this.id,
            deletedAt: this.deletedAt,
            createdAt: this.createdAt
        };
    }
}


class WareHouseGenericReportSubBuilder extends GenericReportSubBuilder{
    constructor(){
        super()
        this.wareHouseId = null;
    }

    setId(wareHouseId){
        this.wareHouseId = wareHouseId;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            wareHouseId: this.wareHouseId
        };
    }
}


class FactorySiteGenericReportSubBuilder extends GenericReportSubBuilder{
    constructor(){
        super()
        this.factorySiteId = null;
    }

    setId(factorySiteId){
        this.factorySiteId = factorySiteId;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            factorySiteId: this.factorySiteId
        };
    }
}



class InventarisationReportSubBuilder extends WareHouseGenericReportSubBuilder{
    constructor(){
        super()
        this.items = null;
    }

    setItems(items){
        this.items = items;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            items: this.items
        };
    }
}



class ReleaseReportSubBuilder extends WareHouseGenericReportSubBuilder{

    constructor(){
        super()
        this.items = null;
        this.supReqReportId = null;
    }

    setWSReportId(supReqReportId){
        this.supReqReportId = supReqReportId;
    }

    setItems(items){
        this.items = items;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            items: this.items,
            supReqReportId: this.supReqReportId
        };
    }
}

class ReplenishmentReportSubBuilder extends WareHouseGenericReportSubBuilder{
    constructor(){
        super()
        this.items = null;
    }

    setItems(items){
        this.items = items;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            items: this.items
        };
    }
}

class WSReplenishmentReportSubBuilder extends WareHouseGenericReportSubBuilder{
    constructor(){
        super()
        this.workShiftReportId = null;
        this.items = null;
        this.unclaimedRemains = null;
    }

    setWSReportId(workShiftReportId){
        this.workShiftReportId = workShiftReportId;
    }

    setItems(items){
        this.items = items;
    }

    setUnclaimedRemains(items){
        this.unclaimedRemains = items;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            items: this.items,
            unclaimedRemains: this.unclaimedRemains,
            workShiftReportId: this.workShiftReportId
        };
    }
}

class ShipmentReportSubBuilder extends WareHouseGenericReportSubBuilder{
    constructor(){
        super()
        this.items = null;
    }

    setItems(items){
        this.items = items;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            items: this.items
        };
    }
}


class WorkShiftReportSubBuilder extends FactorySiteGenericReportSubBuilder{
    constructor(){
        super()
        this.targetWareHouseIds = null;
        this.produced = null;
        this.losses = null;
        this.remains = null;
    }


    setSetTargetWareHouseIds(targetWareHouseIds){
        this.targetWareHouseIds = targetWareHouseIds;
    }

    setItems(produced){
        this.produced = produced;
    }

    setLosses(losses){
        this.losses = losses;
    }

    setRemains(remains){
        this.remains = remains;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            targetWareHouseIds: this.targetWareHouseIds,
            produced: this.produced,
            losses: this.losses,
            remains: this.remains
        };
    }
}

class SupplyRequirementReportSubBuilder extends FactorySiteGenericReportSubBuilder{
    constructor(){
        super()
        this.targetWareHouseIds = null;
        this.items = null;
    }

    setSetTargetWareHouseIds(targetWareHouseIds){
        this.targetWareHouseIds = targetWareHouseIds;
    }

    setItems(items){
        this.items = items;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            targetWareHouseIds: this.targetWareHouseIds,
            items: this.items
        };
    }
}




