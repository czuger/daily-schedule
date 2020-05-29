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

                tasks_array.refresh_tasks_list();
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