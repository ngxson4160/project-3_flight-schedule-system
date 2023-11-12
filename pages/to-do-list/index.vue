<script lang="ts" setup>
import { ref } from "vue";
import { useTodoStore } from "../../stores/to-do.store";

const todoList = useTodoStore();
const isShowAdd = ref(false);
const isShowDelete = ref(false);
const isShowEdit = ref(false);
const idTarget = ref(0);

//Add to do
const addTodo = () => {
  isShowAdd.value = true;
};
const submitAdd = (data: any) => {
  todoList.addTodo(data.data);
  isShowAdd.value = false;
};
const cancelAdd = () => {
  isShowAdd.value = false;
};

//Delete to do
const deleteTodo = (id: number) => {
  idTarget.value = id;
  isShowDelete.value = true;
};
const cancelDelete = () => {
  isShowDelete.value = false;
};
const confirmDelete = () => {
  todoList.delete(idTarget.value);
  isShowDelete.value = false;
};

//Edit to do
const editTodo = (id: number) => {
  idTarget.value = id;
  isShowEdit.value = true;
};
const confirmEdit = (data: any) => {
  console.log("before", todoList.todoList);
  todoList.edit(idTarget.value, data.data);
  console.log("after", todoList.todoList);
  isShowEdit.value = false;
};
const cancelEdit = () => {
  isShowEdit.value = false;
};

//** computed */
const formEditData = computed(() => {
  return todoList.getTodoByID(idTarget.value);
});
</script>

<template>
  <TodoForm v-if="isShowAdd" title="Add to do" typeForm="add" @confirm="submitAdd" @cancel="cancelAdd" />
  <TodoForm
    v-if="isShowEdit"
    title="Edit to do"
    typeForm="edit"
    @confirm="confirmEdit"
    @cancel="cancelEdit"
    :formData="formEditData"
  />
  <ConfirmDelete v-if="isShowDelete" @confirm="confirmDelete" @cancel="cancelDelete" />
  <div class="wrapper">
    <div class="add">
      <button @click="addTodo">Add</button>
    </div>
    <table class="to-do-list">
      <thead>
        <tr>
          <th>STT</th>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(todo, index) in todoList.todoList" :key="todo.id">
          <td>{{ index + 1 }}</td>
          <td>{{ todo.firstName + " " + todo.lastName }}</td>
          <td>{{ todo.age }}</td>
          <td>{{ todo.gender }}</td>
          <td class="action">
            <div @click="editTodo(todo.id)" class="pen">
              <font-awesome-icon icon="pen" />
            </div>
            <div @click="deleteTodo(todo.id)" class="trash">
              <font-awesome-icon icon="trash" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/css/variable.scss";
.wrapper {
  padding: 5px;
  width: 50%;
}
.add {
  display: flex;
  flex-direction: row-reverse;
  button {
    height: 35px;
    width: 75px;
    border: none;
    border-radius: 5px;
    border-color: $primary-color;
    color: white;
    background-color: $primary-color;
    cursor: pointer;
    font-size: $text-16;

    &:hover {
      background-color: $primary-color-light;
    }

    &:active {
      background-color: $primary-color;
    }
  }
}

.to-do-list {
  margin-top: 5px;
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid $lightGrey;
  border-radius: 8px;
  text-align: left;

  thead {
    height: auto;
    width: 100%;
    border: 1px solid #ddd;
    background-color: $primary-color;
    color: white;

    th {
      border: 1px solid #ddd;
      height: 40px;
      padding: 8px;
    }
  }

  tbody {
    td {
      border: 1px solid #ddd;
      height: 40px;
      padding: 8px;
    }
    .trash {
      color: red;
      cursor: pointer;
    }
    .pen {
      cursor: pointer;
    }
  }

  .action {
    padding: 8px 20px 8px 20px;
    display: flex;
    justify-content: space-between;
    border: none;
    height: 100%;
  }
}

.to-do-list th:nth-child(1) {
  width: 10%;
}
.to-do-list th:nth-child(2) {
  width: 40%;
}
.to-do-list th:nth-child(3) {
  width: 15%;
}
.to-do-list th:nth-child(4) {
  width: 15%;
}
.to-do-list th:nth-child(5) {
  width: 11%;
}
</style>
