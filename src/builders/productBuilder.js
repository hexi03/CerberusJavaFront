export class ProductBuilder {

    constructor() {
       this.producedItemId = null;
       this.requirementIds = null;
       this.id = null;
    }
    setProducedItemId(id){
        this.producedItemId = id;
        return this;
    }

    setRequirementIds(ids){
        this.requirementIds = ids;
        return this;
    }

    setId(id){
        this.id = id;
        return this;
    }
    build(){
        return {
            id: this.id,
            producedItemId: this.producedItemId,
            requirementIds: this.requirementIds
        };
    }
}

