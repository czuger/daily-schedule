/**
 * Created by ced on 29/05/2020.
 */

class CustomTask {

    constructor( id, task_desc, task_duration ){
        this.task_desc = task_desc;
        this.task_duration = task_duration;
        this.task_key = 'task_' + id;
        this.id = id;
    }

    compute_times( previous_time ){
        this.start_time = previous_time;
        this.end_time = this.start_time;
        this.end_time = this.end_time.plus({minutes: parseInt(this.task_duration)});

        previous_time = this.end_time;

        this.start_time = this.start_time.toLocaleString({ hour: 'numeric', minute: 'numeric' });
        this.end_time = this.end_time.toLocaleString({ hour: 'numeric', minute: 'numeric' });

        return previous_time;
    }
}

class TasksManager {

    constructor(){
        this.tasks_unique_id = 0;
        this.tasks = [];
        this.day_start_time = luxon.DateTime.local();

        // console.log( this.day_start_time );
        this.day_start_time = this.day_start_time.startOf('day');
        // console.log( this.day_start_time );
        this.day_start_time = this.day_start_time.plus({hours: 12, minutes: 15});
        // console.log( this.day_start_time );

    }

    addTask( task_desc, task_duration ){
        var _t = new CustomTask( this.tasks_unique_id, task_desc, task_duration );
        this.tasks.push( _t );
        this.tasks_unique_id += 1;
        this.recomputeTasksList();
    }

    removeTask( task_key ){
        const index = this.getTaskId(task_key);
        if (index > -1) {
            this.tasks.splice(index, 1);
        }
        this.recomputeTasksList();
    }

    changeDuration( task_key, task_duration ){
        this.tasks[ this.getTaskId(task_key) ].task_duration = task_duration;
        this.recomputeTasksList();
    }

    recomputeTasksList(){
        var previous_time = this.day_start_time;

        for (const task of this.tasks) {
            previous_time = task.compute_times( previous_time );
        }
    }

    getTaskId( task_key ){
        return this.tasks.findIndex( x => x.task_key === task_key );
    }

    load( result, vue ){

        this.tasks_unique_id = parseInt( result.tasks_unique_id );

        if( result.tasks != undefined ){
            this.tasks = [];
            for (const id of Object.keys( result.tasks ) ) {
                var task = result.tasks[ id ];
                this.tasks.push( new CustomTask( task.id, task.task_desc, task.task_duration ) );
            }
        }

        this.recomputeTasksList();
        vue.tasks = this.tasks;
    }

    save(){
        console.log( this.tasks );
        var data = {
            tasks: this.tasks,
            tasks_unique_id: this.tasks_unique_id
        }

        $.post( "/tasks/create", { data: data } )
    }
}
