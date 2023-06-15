/** @odoo-module **/
import { Component,useState} from "@odoo/owl";
import { Todo } from "./todo";

export class TodoList extends Component {
    static template = "owl_playground.todolist";  
    setup() {
        this.todolists = useState([]);
        this.new_id=0;
        // this.inputRef = useRef("Todolist");
    }

    add(event){
        // console.log(this.inputRef.el);
        // console.log(event.target.value);
        if(event.keyCode === 13 && event.target.value != ""){
            this.todolists.push({id:this.new_id++,description:event.target.value,done:false});
            event.target.value="";
        }
    }

    toggleTodo(todoId){
        // const todo = this.todoList.find((todo) => todo.id === todoId);
        for(let todo of this.todolists){
        if (todo.id === todoId) {
            todo.done = ! todo.done; 
        }
        }
    }
    

    removeTodo(elemId) {
        const index = this.todolists.findIndex((elem) => elem.id === elemId);
        if (index >= 0) {
            this.todolists.splice(index, 1);
        }
    }

    static components={Todo};
}

