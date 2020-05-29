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

    show_task( previous_time ){
        var _tm = $( '#task_model' ).clone();
        var _tl = _tm.find( '#task_desc' );
        var _td = _tm.find( '#task_duration' );
        var _ts = _tm.find( '#task_start' );
        var _te = _tm.find( '#task_end' );
        var _tr = _tm.find( '.task_remove' );

        var start_time = previous_time;
        var end_time = start_time;
        end_time = end_time.plus({minutes: parseInt(this.task_duration)});

        // console.log( start_time, end_time );

        _tl.html( this.task_desc );
        _td.val( this.task_duration );
        _td.attr( 'task_id', this.task_key );
        _tm.attr( 'task_id', this.task_key );
        _tr.attr( 'task_id', this.task_key );

        _ts.html( start_time.toLocaleString({ hour: 'numeric', minute: 'numeric' }));
        _te.html( end_time.toLocaleString({ hour: 'numeric', minute: 'numeric' }));

        _tm.attr( 'id', 'task_model_' + this.task_key );
        _tl.attr( 'id', 'task_desc_' + this.task_key );
        _td.attr( 'id', 'task_duration_' + this.task_key );
        _ts.attr( 'id', 'task_start_' + this.task_key );
        _te.attr( 'id', 'task_end_' + this.task_key );

        $( '#tasks_list' ).append( _tm );

        return end_time;
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
        this.day_start_time = this.day_start_time.plus({hours: 6, minutes: 30});
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

    refresh_tasks_list(){

        $('#tasks_list').empty();

        var previous_time = this.day_start_time;

        for (const task_key of this.tasks_order) {
            previous_time = this.tasks[ task_key ].show_task( previous_time );
        }
    }

    load( result ){
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

        this.refresh_tasks_list();
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
