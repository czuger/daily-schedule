const set_tasks_vue = function(){

    Vue.component('scheduled-task', {
        props: ['task_data'],
        template: `<div class="row sortable-row mt-3" v-bind:task_id="task_data.id">
            <div class="col-1">
            <button name="button" type="submit" @click="task_check(task_data.id)" class="btn btn-block" v-bind:class="[task_data.check ? 'btn-success' : 'btn-warning']">
                {{ task_data.check ? 'V' : 'O' }}
            </button>
            </div>
            <div class="col-7">
                <strike v-if="task_data.check">{{ task_data.task_desc }}</strike>
                <span v-else>{{ task_data.task_desc }}</span>
            </div>
            <div class="col-1">{{ task_data.start_time }}</div>
            <div class="col-1">{{ task_data.end_time }}</div>
            <div class="col-1">
            <input type="number" name="task_duration" v-on:change="duration_change(task_data.id)" v-model="task_data.task_duration" class="form-control">
            </div>
            <div class="col-1">
            <button name="button" type="submit" @click="task_removal(task_data.id)" class="btn btn-danger btn-block">X</button>
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
            },
            task_check: function (task_id) {
                tasks_array.taskCheck(task_id);
                tasks_array.save();
            }

        }
    });

    var v = new Vue({
        el: "#tasks",
        data: {
            new_task: null,
            duration: null,

            start_hour: 8,
            start_minute: 0,

            tasks: null,

            componentKey: 0
        },
        watch: {
            start_hour: function (val) {
                tasks_array.setStartTime(this.start_hour, this.start_minute);
                LsManager.set_value( 'daily-schedule', 'start_hour', this.start_hour );
            },
            start_minute: function (val) {
                tasks_array.setStartTime(this.start_hour, this.start_minute);
                LsManager.set_value( 'daily-schedule', 'start_minute', this.start_minute );
            },
        },
        methods: {
            add_task: function (event) {

                if( v.duration == null ){
                    v.duration = 30;
                }

                tasks_array.addTask( v.new_task, v.duration );
                tasks_array.save();

                v.new_task = null;
                v.duration = null;

                $('#new_task').focus();
            },
            // According to https://stackoverflow.com/questions/32106155/can-you-force-vue-js-to-reload-re-render
            // and https://michaelnthiessen.com/force-re-render/
            // this is the best solution.
            force_refresh: function(){
                this.componentKey += 1;
            }
        },
        mounted: function() {
            // tasks_array.setStartTime(this.start_hour, this.start_minute);
            const hour = LsManager.get_value( 'daily-schedule', 'start_hour' ) || 8;
            const minute = LsManager.get_value( 'daily-schedule', 'start_minute' ) || 0;

            this.start_hour = hour;
            this.start_minute = minute;

            // tasks_array.setStartTime(this.start_hour, this.start_minute);
        }
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

    tasks_array.load();
    set_tasks_sortable();
};

// Initialisation
$(function() {
    set_tasks_vue();

    // $(document).keypress(function(event){
    //
    //     // Thanks to https://stackoverflow.com/questions/57843201/trigger-a-html-button-when-you-press-enter
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     // console.log( keycode );
    //     if(keycode == '13'){
    //         // $("#add_task").click();
    //     }});
});