import {ReportType} from "./reportTypes.js";
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
                console.log("Invalid report type: " + type);
                throw new Error("Invalid report type: " + type);
        }
    }

}

class GenericReportSubBuilder{
    constructor(){
        this.id = null;
        this.createdAt = null;
        this.deletedAt = null;
        this.creatorId = null;

    }

    setId(id){
        this.id = id;
        return this;
    }

    setCreatorId(creatorId){
        this.creatorId = creatorId;
        return this;
    }

    setCreatedAt(createdAt){
        this.createdAt = createdAt;
        return this;
    }

    setDeletedAt(deletedAt){
        this.deletedAt = deletedAt;
        return this;
    }

    build(){
        return {
            id: this.id,
            deletedAt: this.deletedAt,
            createdAt: this.createdAt,
            creatorId :this.creatorId
        };
    }
}


class WareHouseGenericReportSubBuilder extends GenericReportSubBuilder{
    constructor(){
        super()
        this.wareHouseId = null;
    }

    setWareHouseId(wareHouseId){
        this.wareHouseId = wareHouseId;
        return this;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            type: ReportType.WH_GENERIC,
            wareHouseId: this.wareHouseId
        };
    }
}


class FactorySiteGenericReportSubBuilder extends GenericReportSubBuilder{
    constructor(){
        super()
        this.factorySiteId = null;
    }

    setFactorySiteId(factorySiteId){
        console.log("setFactorySiteId: ");
        console.log(factorySiteId);
        this.factorySiteId = factorySiteId;
        return this;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            type: ReportType.FS_GENERIC,
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
        return this;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            type: ReportType.WH_INVENTARISATION,
            items: this.items
        };
    }
}



class ReleaseReportSubBuilder extends WareHouseGenericReportSubBuilder{

    constructor(){
        super()
        this.items = null;
        this.supplyReqReportId = null;
    }

    setSupReqReportId(supplyReqReportId){
        this.supplyReqReportId = supplyReqReportId;
        return this;
    }

    setItems(items){
        this.items = items;
        return this;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            type: ReportType.WH_RELEASE,
            items: this.items,
            supplyReqReportId: this.supplyReqReportId
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
        return this;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            type: ReportType.WH_REPLENISHMENT,
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
        return this;
    }

    setItems(items){
        this.items = items;
        return this;
    }

    setUnclaimedRemains(items){
        this.unclaimedRemains = items;
        return this;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            type: ReportType.WH_WS_REPLENISHMENT,
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
        return this;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            type: ReportType.WH_SHIPMENT,
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


    setTargetWareHouseIds(targetWareHouseIds){
        this.targetWareHouseIds = targetWareHouseIds;
        return this;
    }

    setProducedItems(produced){
        this.produced = produced;
        return this;
    }

    setLosses(losses){
        this.losses = losses;
        return this;
    }

    setRemains(remains){
        this.remains = remains;
        return this;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            type: ReportType.FS_WORKSHIFT,
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

    setTargetWareHouseIds(targetWareHouseIds){
        this.targetWareHouseIds = targetWareHouseIds;
        return this;
    }

    setItems(items){
        this.items = items;
        return this;
    }

    build(){
        const base = super.build();
        return {
            ...base,
            type: ReportType.FS_SUP_REQ,
            targetWareHouseIds: this.targetWareHouseIds,
            items: this.items
        };
    }
}




