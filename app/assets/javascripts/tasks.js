const set_tasks_vue = function(){

    Vue.component('scheduled-task', {
        props: ['task_data'],
        template: `<div class="row sortable-row mt-3" v-bind:task_id="task_data.id">
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

            tasks: null,

            componentKey: 0
        },
        methods: {
            add_task: function (event) {
                tasks_array.addTask( v.new_task, v.duration );
                tasks_array.save();

                v.new_task = null;
                v.duration = null;
            },
            // According to https://stackoverflow.com/questions/32106155/can-you-force-vue-js-to-reload-re-render
            // and https://michaelnthiessen.com/force-re-render/
            // this is the best solution.
            force_refresh: function(){
                this.componentKey += 1;
            }
        },
    });

    const set_tasks_sortable = function() {
        $( "#tasks_list" ).sortable(
            {
                items: '.sortable-row',
                stop: function(){

                    let new_order = [];
                    $("#tasks_list").children().each(function(){
                        new_order.push( parseInt( $(this).attr( 'task_id') ) );
                    });

                    // console.log( new_order );
                    tasks_array.reorder( new_order );
                    tasks_array.save();

                    // Have to force refresh here otherwise reorder is not immediately taken in account.
                    v.force_refresh();
                }
            }
        );
        $( "#tasks_list" ).disableSelection();
    }

    var tasks_array = new TasksManager( v );
    $.getJSON( "/tasks/load", function( result ){
        tasks_array.load( result );
        set_tasks_sortable();
    } );
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