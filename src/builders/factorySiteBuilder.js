export class FactorySiteBuilder {

    constructor() {
       this.name = null;
       this.id = null;
       this.departmentId = null;
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
    build(){
        return {
            id: this.id,
            departmentId: this.departmentId,
            name: this.name
        };
    }
}
