export class GroupBuilder {

    constructor() {
       this.name = null;
       this.id = null;
       this.userIds = null;
    }
    setName(name){
        this.name = name;
        return this;
    }

    setId(id){
        this.id = id;
        return this;
    }

    setUserIds(userIds){
        this.userIds = userIds;
        return this;
    }

    build(){
        return {
            id: this.id,
            name: this.name,
            userIds: this.userIds

        };
    }
}
