export class GroupBuilder {

    constructor() {
       this.name = null;
       this.id = null;
    }
    setName(name){
        this.name = name;
        return this;
    }

    setId(id){
        this.id = id;
        return this;
    }
    build(){
        return {
            id: this.id,
            name: this.name
        };
    }
}
