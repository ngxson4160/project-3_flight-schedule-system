import { defineStore } from "pinia";

export const useTodoStore = defineStore("todo-list", {
  state: () => {
    let todoList = [
      {
        id: 1,
        firstName: "Nguyễn Xuân",
        lastName: " Sơn",
        age: 22,
        gender: "Male",
      },
      {
        id: 2,
        firstName: "Nguyễn Văn",
        lastName: "A",
        age: 21,
        gender: "Male",
      },
      {
        id: 3,
        firstName: "Lê Thị",
        lastName: "B",
        age: 22,
        gender: "Female",
      },
      {
        id: 4,
        firstName: "Nguyễn Văn",
        lastName: "Sơn",
        age: 12,
        gender: "Male",
      },
      {
        id: 5,
        firstName: "Trần Văn",
        lastName: "C",
        age: 92,
        gender: "Male",
      },
    ];
    return { todoList };
  },
  actions: {
    addTodo(param: any) {
      let length = this.todoList.length;
      this.todoList = [{ id: length + 1, ...param }, ...this.todoList];
    },
    delete(id: number) {
      this.todoList = this.todoList.filter((el) => el.id != id);
    },
    edit(id: number, param: any) {
      this.todoList = this.todoList.map((el) => {
        if (el.id === id) {
          el = param;
        }
        return el;
      });
    },
    getTodoByID(id: number) {
      return this.todoList.find((todo) => todo.id === id);
    },
  },
  getters: {},
});
