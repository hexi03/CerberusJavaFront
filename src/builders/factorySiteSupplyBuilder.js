export class FactorySiteSupplyBuilder {

    constructor() {
       this.suppliers = [];
    }
    addSupplier(id){
        this.suppliers.push(id);
        return this;
    }

    build(){
        return {
            suppliers: this.suppliers,
        };
    }
}
