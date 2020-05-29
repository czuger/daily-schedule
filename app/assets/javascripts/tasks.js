const set_tasks_vue = function(){
    var v = new Vue({
        el: "#add_tasks_bar",
        data: {
            new_task: null,
            duration: null,
            task_duration_modification: null
        },
        methods: {
            add_task: function (event) {
                // console.log( v.new_task, v.duration );
                // console.log( tasks_array );

                tasks_array.addTask( v.new_task, v.duration );
                tasks_array.refresh_tasks_list();

                set_task_duration_watch();
            },
        },
    });

    const tasks_array = new TasksManager();

    const set_task_duration_watch = function(){
        $( '.task_duration' ).change( function(){
            var _t = $(this);
            tasks_array.changeDuration( _t.attr( 'task_id' ), _t.val() );
            tasks_array.refresh_tasks_list();

            set_task_duration_watch();

            sort_gangs()
        });
    };

    const sort_gangs = function() {
        $( "#tasks_list" ).sortable(
            {
                items: '.sortable-row',
                stop: function(){
                    console.log( 'toto' );
                    $("#tasks_list").children().each(function(){
                        console.log( $(this) );
                    });
                }
            }
        );
        $( "#tasks_list" ).disableSelection();
    }

    sort_gangs();

};

// Initialisation
$(function() {
    set_tasks_vue();
});