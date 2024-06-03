export class FactorySiteBuilder {

    constructor() {
       this.name = null;
       this.id = null;
       this.departmentId = null;
       this.suppliers = null;
    }
    setName(name){
        this.name = name;
        return this;
    }

    setDepartmentId(departmentId){
        this.departmentId = departmentId;
        return this;
    }

    setId(id){
        this.id = id;
        return this;
    }

    setSuppliers(sup){
        this.suppliers = sup;
        return this;
    }
    build(){
        console.log("this.suppliers")
        console.log(this.suppliers)
        return {
            id: this.id,
            departmentId: this.departmentId,
            name: this.name,
            suppliers: this.suppliers
        };
    }
}
