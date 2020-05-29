/**
 * Created by ced on 29/05/2020.
 */

class CustomTask {

    constructor( task_desc, task_duration ){
        this.task_desc = task_desc;
        this.task_duration = task_duration;
    }

    show_task( index, previous_time ){
        var _tm = $( '#task_model' ).clone();
        var _tl = _tm.find( '#task_desc' );
        var _td = _tm.find( '#task_duration' );
        var _ts = _tm.find( '#task_start' );
        var _te = _tm.find( '#task_end' );

        var start_time = previous_time;
        var end_time = start_time;
        end_time = end_time.plus({minutes: parseInt(this.task_duration)});

        console.log( start_time, end_time );

        _tl.html( this.task_desc );
        _td.html( this.task_duration );
        _ts.html( start_time.toLocaleString({ hour: 'numeric', minute: 'numeric' }));
        _te.html( end_time.toLocaleString({ hour: 'numeric', minute: 'numeric' }));

        _tm.attr( 'id', 'task_model_' + index );
        _tl.attr( 'id', 'task_desc_' + index );
        _td.attr( 'id', 'task_duration_' + index );
        _ts.attr( 'id', 'task_start_' + index );
        _te.attr( 'id', 'task_end_' + index );

        $( '#tasks_list' ).append( _tm );

        return end_time;
    }

}

class TasksManager {

    constructor(){
        this.tasks = [];
        this.day_start_time = luxon.DateTime.local();

        console.log( this.day_start_time );
        this.day_start_time = this.day_start_time.startOf('day');
        console.log( this.day_start_time );
        this.day_start_time = this.day_start_time.plus({hours: 6, minutes: 30});
        console.log( this.day_start_time );

    }

    addTask( task_desc, task_duration ){
        this.tasks.push( new CustomTask( task_desc, task_duration ) );
    }

    refresh_tasks_list(){

        $('#tasks_list').empty();

        var previous_time = this.day_start_time;

        this.tasks.forEach(function (item, index) {
            previous_time = item.show_task( index, previous_time );
        });
    }
}
