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

    force_key( key ){
        this.task_key = key;
    }

}

class TasksManager {

    constructor(){
        this.tasks_unique_id = 0;
        this.tasks = {};
        this.tasks_order = [];
        this.day_start_time = luxon.DateTime.local();

        // console.log( this.day_start_time );
        this.day_start_time = this.day_start_time.startOf('day');
        // console.log( this.day_start_time );
        this.day_start_time = this.day_start_time.plus({hours: 12, minutes: 15});
        // console.log( this.day_start_time );

    }

    addTask( task_desc, task_duration ){
        var _t = new CustomTask( this.tasks_unique_id, task_desc, task_duration );
        this.tasks[ _t.task_key ] = _t;
        this.tasks_order.push( _t.task_key );
        this.tasks_unique_id += 1;
    }

    removeTask( task_key ){
        delete this.tasks[ task_key ];

        const index = this.tasks_order.indexOf(task_key);
        if (index > -1) {
            this.tasks_order.splice(index, 1);
        }
    }

    changeDuration( task_id, task_duration ){
        this.tasks[ task_id ].task_duration = task_duration;
    }

    recomputeTasksList(){

        // $('#tasks_list').empty();

        var previous_time = this.day_start_time;

        for (const task_key of this.tasks_order) {
            previous_time = this.tasks[ task_key ].compute_times( previous_time );
        }
    }

    toVueJsArray() {
        return this.tasks_order.map(e => this.tasks[e]);
    }

    load( result, vue ){
        // console.log( result );

        this.tasks_unique_id = parseInt( result.tasks_unique_id );

        if( result.tasks != undefined ){
            this.tasks_order = result.tasks_order;


            this.tasks = {};
            for (const task_key of Object.keys( result.tasks ) ) {
                var _d = result.tasks[ task_key ];
                var _t = new CustomTask( _d.id, _d.task_desc, _d.task_duration );
                this.tasks[ task_key ] = _t;
            }
        }

        this.recomputeTasksList();
        vue.tasks = this.toVueJsArray();
    }

    save(){
        var data = {
            tasks_order: this.tasks_order,
            tasks: this.tasks,
            tasks_unique_id: this.tasks_unique_id
        }

        $.post( "/tasks/create", { data: data } )
    }
}
