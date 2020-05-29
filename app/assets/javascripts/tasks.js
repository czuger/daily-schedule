// Unit type part
const set_tasks_vue = function(){
    var v = new Vue({
        el: "#add_tasks_bar",
        data: {
            new_task: null,
            duration: null,
            task_id: 1
        },
        methods: {
            add_task: function (event) {
                console.log( v.new_task, v.duration );

                var _tm = $( '#task_model' ).clone();
                var _tl = _tm.find( '#task_libe' );

                _tl.html( v.new_task );

                _tm.attr( 'id', 'task_model_' + v.task_id );
                _tm.attr( 'id', 'task_libe_' + v.task_id );

                $( '#tasks_list' ).append( _tm );

                v.task_id += 1;
            }
        }
    });
};

// Initialisation
$(function() {
    set_tasks_vue();
});