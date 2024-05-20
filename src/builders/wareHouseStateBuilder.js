export class WareHouseStateBuilder {

    constructor() {
       this.id = null;
       this.storageState = null;
       this.problems = null;
        this.warnings = null;
    }
    setProblems(problems){
        this.problems = problems;
        return this;
    }

    setWarnings(warnings){
        this.warnings = warnings;
        return this;
    }

    setStorageState(storageState){
        this.storageState = storageState;
        return this;
    }

    setId(id){
        this.id = id;
        return this;
    }
    build(){
        return {
            id: this.id,
            warnings: this.warnings,
            problems: this.problems,
            storageState: this.storageState
        };
    }
}
