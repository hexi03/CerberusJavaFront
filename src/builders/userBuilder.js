export class UserBuilder {

    constructor() {
       this.name = null;
       this.password = null;
       this.id = null;
       this.groupIds = null;
    }
    setName(name){
        this.name = name;
        return this;
    }

    setPassword(password){
        this.password = password;
        return this;
    }

    setGroupIds(groupIds){
        this.groupIds = groupIds;
        return this;
    }


    setId(id){
        this.id = id;
        return this;
    }
    build(){
        return {
            id: this.id,
            name: this.name,
            password: this.password,
            groupIds: this.groupIds
        };
    }
}

