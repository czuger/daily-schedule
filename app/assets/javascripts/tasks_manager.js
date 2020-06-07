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

    getVueCompatibleObject(){
        return{ task_desc: this.task_desc, task_duration: this.task_duration, start_time: this.start_time,
            end_time: this.end_time, id: this.id }
    }
}

class TasksManager {

    constructor( vue ){
        this.tasks = [];
        this.day_start_time = luxon.DateTime.local();

        // console.log( this.day_start_time );
        this.day_start_time = this.day_start_time.startOf('day');
        // console.log( this.day_start_time );
        this.day_start_time = this.day_start_time.plus({hours: 12, minutes: 15});
        // console.log( this.day_start_time );

        this.vue = vue;

    }

    addTask( task_desc, task_duration ){
        var _t = new CustomTask( task_desc, task_duration );

        this.tasks.push( _t );
        this.recomputeTasksList();
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

        // console.log( this.tasks.length );

        for ( var index = 0; index < this.tasks.length; index++ ) {
            previous_time = this.tasks[ index ].compute_times( previous_time );
            this.tasks[ index ].id = index;

            console.log( this.tasks[ index ].task_desc, this.tasks[ index ].start_time );

            // console.log( index );
        }

        // Don't work with add task with direct link to this.tasks
        this.vue.tasks = this.getVueCompatibleObject();
    }

    reorder( new_order ){
        let new_tab = [];

        for( let task_id of new_order ){
            new_tab.push( this.tasks[ task_id ] );
        }

        this.tasks = new_tab;
        this.recomputeTasksList();
    }

    getVueCompatibleObject(){
        let obj = [];

        for( let elem of this.tasks){
            obj.push( elem.getVueCompatibleObject() );
        }

        return obj;
    }

    load( result ){
        if( result != undefined ){
            this.tasks = [];
            for (const id of Object.keys( result ) ) {
                var task = result[ id ];
                this.tasks.push( new CustomTask( task.task_desc, task.task_duration ) );
            }
        }

        this.recomputeTasksList();
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
