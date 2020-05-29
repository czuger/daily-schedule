/**
 * Created by ced on 29/05/2020.
 */

class CustomTask {

    constructor( task_desc, task_duration ){
        this.task_desc = task_desc;
        this.task_duration = task_duration;
    }
}

class TasksManager {

    constructor(){
        this.tasks = [];
    }

    addTask( task_desc, task_duration ){
        this.tasks.push( new CustomTask( task_desc, task_duration ) );
    }
}
