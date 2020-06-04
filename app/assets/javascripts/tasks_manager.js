/**
 * Created by ced on 29/05/2020.
 */

class CustomTask {

    constructor( task_desc, task_duration ){
        this.task_desc = task_desc;
        this.task_duration = task_duration;
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
        this.tasks = [];
        this.day_start_time = luxon.DateTime.local();

        // console.log( this.day_start_time );
        this.day_start_time = this.day_start_time.startOf('day');
        // console.log( this.day_start_time );
        this.day_start_time = this.day_start_time.plus({hours: 12, minutes: 15});
        // console.log( this.day_start_time );

    }

    addTask( vue, task_desc, task_duration ){
        var _t = new CustomTask( task_desc, task_duration );

        console.log( this.tasks );
        this.tasks.push( _t );
        console.log( this.tasks );

        // this.recomputeTasksList();

        // vue.tasks = this.tasks;

        // this.tasks.splice(this.tasks.length+1);
    }

    removeTask( task_id ){
        // const index = this.getTaskId(task_id);
        if (task_id > -1) {
            this.tasks.splice(task_id, 1);
        }
        this.recomputeTasksList();
    }

    changeDuration( task_id, task_duration ){
        this.tasks[ task_id ].task_duration = task_duration;
        this.recomputeTasksList();
    }

    recomputeTasksList(){
        var previous_time = this.day_start_time;

        console.log( this.tasks.length );

        for ( var index = 0; index < this.tasks.length; index++ ) {
            previous_time = this.tasks[ index ].compute_times( previous_time );
            this.tasks[ index ].id = index;

            console.log( this.tasks[ index ].task_desc, this.tasks[ index ].start_time );

            // console.log( index );
        }
    }

    getTaskId( task_id ){
        return this.tasks.findIndex( x => x.task_id === task_id );
    }

    load( result, vue ){
        if( result != undefined ){
            this.tasks = [];
            for (const id of Object.keys( result ) ) {
                var task = result[ id ];
                this.tasks.push( new CustomTask( task.task_desc, task.task_duration ) );
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

        $.post( "/tasks/create", { data: this.tasks } )
    }
}
