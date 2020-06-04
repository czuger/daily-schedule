const set_tasks_vue = function(){

    Vue.component('scheduled-task', {
        props: ['task_data'],
        template: `<div class="row sortable-row mt-3">
            <div class="col-6">{{ task_data.task_desc }}</div>
            <div class="col-1">{{ task_data.start_time }}</div>
            <div class="col-1">{{ task_data.end_time }}</div>
            <div class="col-1">
            <input type="number" name="task_duration" v-on:change="duration_change(task_data.id)" v-model="task_data.task_duration" class="form-control">
            </div>
            <div class="col-1">
            <button name="button" type="submit" @click="task_removal(task_data.id)" class="btn btn-danger">remove_task</button>
            </div>
        </div>`,
        methods: {
            duration_change: function (task_id) {
                tasks_array.changeDuration(task_id, this.task_data.task_duration);
                tasks_array.save();
            },
            task_removal: function (task_id) {
                tasks_array.removeTask(task_id);
                tasks_array.save();
            }
        }
    });

    var v = new Vue({
        el: "#tasks",
        data: {
            new_task: null,
            duration: null,

            tasks: []
        },
        methods: {
            add_task: function (event) {
                var _t = new CustomTask( v.new_task, v.duration );

                this.tasks.push( _t );

                tasks_array.recomputeTasksList();

                tasks_array.save();

                v.new_task = null;
                v.duration = null;
            },
        },
    });

    var tasks_array = new TasksManager();
    $.getJSON( "/tasks/load", function( result ){
        tasks_array.load( result, v );
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
};

// Initialisation
$(function() {
    set_tasks_vue();

    $(document).keypress(function(event){

        // Thanks to https://stackoverflow.com/questions/57843201/trigger-a-html-button-when-you-press-enter
        var keycode = (event.keyCode ? event.keyCode : event.which);
        // console.log( keycode );
        if(keycode == '13'){
            // $("#add_task").click();
        }});
});