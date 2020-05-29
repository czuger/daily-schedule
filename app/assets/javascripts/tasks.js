// Unit type part
const set_tasks_vue = function(){
    var v = new Vue({
        el: "#add_tasks_bar",
        data: {
            new_task: null,
            duration: null
        },
        methods: {
            add_task: function (event) {
                console.log( v.new_task, v.duration );
            }
        }
    });
};

// Initialisation
$(function() {
    set_tasks_vue();
});