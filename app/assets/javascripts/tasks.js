// Unit type part
var tasks_array = new TasksManager();

const set_tasks_vue = function(){
    var v = new Vue({
        el: "#add_tasks_bar",
        data: {
            new_task: null,
            duration: null,
            day_start_time: Date.now(),
            task_id: 1,
        },
        methods: {
            add_task: function (event) {
                console.log( v.new_task, v.duration );

                console.log( tasks_array );

                tasks_array.addTask( v.new_task, v.duration );

                // var _tm = $( '#task_model' ).clone();
                // var _tl = _tm.find( '#task_libe' );
                // var _td = _tm.find( '#task_duration' );
                //
                // _tl.html( v.new_task );
                // _td.html( v.duration );
                //
                // _tm.attr( 'id', 'task_model_' + v.task_id );
                // _tl.attr( 'id', 'task_libe_' + v.task_id );
                // _td.attr( 'id', 'task_duration' + v.task_id );
                //
                // $( '#tasks_list' ).append( _tm );
                //
                // v.task_id += 1;
            },

        },
    });

    // v.day_start_time.setHours( 6 );
    // v.day_start_time.setMinutes( 0 );
    // v.day_start_time.setSeconds( 0 );
    // v.day_start_time.setMilliseconds( 0 );
};

// Initialisation
$(function() {
    set_tasks_vue();
});