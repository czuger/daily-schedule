/**
 * Created by ced on 29/05/2020.
 */

class CustomTask {

    constructor( task_desc, task_duration ){
        this.task_desc = task_desc;
        this.task_duration = task_duration;
    }

    show_task( index ){
        var _tm = $( '#task_model' ).clone();
        var _tl = _tm.find( '#task_desc' );
        var _td = _tm.find( '#task_duration' );

        _tl.html( this.task_desc );
        _td.html( this.task_duration );

        _tm.attr( 'id', 'task_model_' + index );
        _tl.attr( 'id', 'task_desc_' + index );
        _td.attr( 'id', 'task_duration_' + index );

        $( '#tasks_list' ).append( _tm );
    }
}

class TasksManager {

    constructor(){
        this.tasks = [];
    }

    addTask( task_desc, task_duration ){
        this.tasks.push( new CustomTask( task_desc, task_duration ) );
    }

    refresh_tasks_list(){

        $('#tasks_list').empty();

        this.tasks.forEach(function (item, index) {
            item.show_task( index );
        });
    }
}
