const set_tasks_vue = function(){
    var v = new Vue({
        el: "#add_tasks_bar",
        data: {
            new_task: null,
            duration: null,
        },
        methods: {
            add_task: function (event) {
                // console.log( v.new_task, v.duration );
                // console.log( tasks_array );

                tasks_array.addTask( v.new_task, v.duration );
                tasks_array.refresh_tasks_list();

                after_modification();

                v.new_task = null;
                v.duration = null;
            },
        },
    });

    const tasks_array = new TasksManager();
    $.getJSON( "/tasks/load", function( result ){
        tasks_array.load( result );

        after_modification();
    } );

    const set_task_duration_watch = function(){
        $( '.task_duration' ).change( function(){
            var _t = $(this);
            tasks_array.changeDuration( _t.attr( 'task_id' ), _t.val() );

            after_modification();
        });
    };

    const set_task_remove_watch = function(){
        $( '.task_remove' ).click( function(){
            var _t = $(this);
            tasks_array.removeTask( _t.attr( 'task_id' ) );

            after_modification();
        });
    };

    const set_tasks_sortable = function() {
        $( "#tasks_list" ).sortable(
            {
                items: '.sortable-row',
                stop: function(){

                    tasks_array.tasks_order = [];

                    $("#tasks_list").children().each(function(){
                        tasks_array.tasks_order.push( $(this).attr( 'task_id') );
                        // console.log( $(this).attr( 'task_id') );
                    });

                    after_modification();
                }
            }
        );
        $( "#tasks_list" ).disableSelection();
    }

    const after_modification = function() {
        tasks_array.refresh_tasks_list();
        set_task_duration_watch();
        set_task_remove_watch();
        set_tasks_sortable();
        tasks_array.save();
    }
};

// Initialisation
$(function() {
    set_tasks_vue();

    $(document).keypress(function(event){

        var keycode = (event.keyCode ? event.keyCode : event.which);
        console.log( keycode );
        if(keycode == '13'){
            $("#add_task").click();
        }});
});