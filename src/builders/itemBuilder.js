export class ItemBuilder {

    constructor() {
       this.name = null;
       this.units = null;
       this.id = null;
    }
    setName(name){
        this.name = name;
        return this;
    }

    setUnits(units){
        this.units = units;
        return this;
    }

    setId(id){
        this.id = id;
        return this;
    }
    build(){
        return {
            id: this.id,
            units: this.units,
            name: this.name
        };
    }
}
