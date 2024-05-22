export class UserBuilder {

    constructor() {
       this.name = null;
       this.password = null;
       this.id = null;
       this.email = null;
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

    setEmail(email){
        this.email = email;
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
            email: this.email,
            groupIds: this.groupIds
        };
    }
}

