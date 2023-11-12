<script lang="ts" setup>
import { validateName } from "../common/validate/name-validate";
import { reactive } from "vue";
const props = defineProps({
  formData: {
    type: Object,
    default: {
      firstName: "",
      lastName: "",
      age: "",
      gender: "Male",
    },
  },
  typeForm: { type: String, required: true },
  title: String,
});
const emit = defineEmits(["confirm", "cancel"]);

const editedData = reactive({ ...props.formData });

const validateForm = reactive({
  message: {} as any,
  flag: false,
  validFirstName: true,
  validLastName: true,
  validAge: true,
});
const addNewTodo = () => {
  validateForm.flag = true;
  if (!validate()) return;
  emit("confirm", { data: editedData });
};

const editTodo = () => {
  validateForm.flag = true;
  if (!validate()) return;
  emit("confirm", { data: editedData });
};

const validate = () => {
  validateForm.message = {};
  if (editedData["firstName"] === "" || editedData["lastName"] === "" || editedData["age"] === "") {
    validateForm.message.notFill = "Please fill in all required information!";
    return false;
  }
  if (!validateName(editedData["firstName"])) {
    validateForm.message.firstName = "First name is invalid!";
    validateForm.validFirstName = false;
  } else {
    validateForm.validFirstName = true;
  }
  if (!validateName(editedData["lastName"])) {
    validateForm.message.lastName = "Last name is invalid!";
    validateForm.validLastName = false;
  } else {
    validateForm.validLastName = true;
  }
  if (editedData["age"] < "0" || isNaN(+editedData["age"])) {
    validateForm.message.age = "Age is invalid!";
    validateForm.validAge = false;
  } else {
    validateForm.validAge = true;
  }
  if (validateForm.validFirstName && validateForm.validLastName && validateForm.validAge) return true;
  else return false;
};
</script>

<template>
  <div class="backdrop"></div>
  <div class="form-add">
    <h3 class="title">{{ title }}</h3>
    <p class="message-all">{{ validateForm.message.notFill }}</p>
    <form @submit.prevent="typeForm === 'add' ? addNewTodo() : editTodo()">
      <div class="from-group f-name">
        <span class="label">Name*</span>
        <div class="input-area">
          <div class="f-name-inner firstname">
            <p class="message">{{ validateForm.message.firstName }}</p>
            <input
              :class="{ invalidForm: (validateForm.flag && !!!editedData.firstName) || !validateForm.validFirstName }"
              type="text"
              name="firstname"
              placeholder="Your first name"
              v-model="editedData.firstName"
              spellcheck="false"
            />
          </div>
          <div class="f-name-inner lastname">
            <p class="message">{{ validateForm.message.lastName }}</p>
            <input
              type="text"
              name="lastname"
              placeholder="Your last name"
              v-model="editedData.lastName"
              :class="{ invalidForm: (validateForm.flag && !!!editedData.lastName) || !validateForm.validLastName }"
              spellcheck="false"
            />
          </div>
        </div>
      </div>

      <div class="from-group f-age">
        <p class="message">{{ validateForm.message.age }}</p>
        <span class="label">Age*</span>
        <input
          class="f-age-inner"
          :class="{ invalidForm: (validateForm.flag && !!!editedData.age) || !validateForm.validAge }"
          type="text"
          name="lastname"
          placeholder="Your age"
          v-model="editedData.age"
        />
      </div>

      <div class="from-group f-gender">
        <span class="label">Gender*</span>
        <select id="gender" name="gender" v-model="editedData.gender">
          <option value="Male" selected>Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="action">
        <button type="submit" class="submit">Submit</button>
        <div @click="$emit('cancel')" class="cancel">Cancel</div>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/css/variable.scss";
.invalidForm {
  border-color: $darkRed !important;
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $background-color;
}
.form-add {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: auto;
  background-color: white;
  border-radius: 4px;
  .title {
    margin: 15px 0px 25px;
    text-align: center;
  }
  .message-all {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: red;
  }
  form {
    padding: 10px;
    display: flex;
    flex-direction: column;
    .from-group {
      display: flex;
      border-radius: 8px;
      height: 100%;
      margin-bottom: 20px;
      .label {
        display: inline-block;
        width: 70px;
        margin: auto 0 auto 0;
      }
    }
    .action {
      display: flex;
      margin-left: 65%;
      justify-content: space-between;
    }
    .submit {
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
    .cancel {
      height: 35px;
      width: 75px;
      border-radius: 5px;
      background-color: $mediumGrey;
      cursor: pointer;
      text-align: center;
      line-height: 35px;
      font-size: $text-16;

      &:hover {
        background-color: $lightGrey;
      }

      &:active {
        background-color: $mediumGrey;
      }
    }

    input {
      height: 30px;
      border: none;
      text-decoration: none;
      &:focus {
        outline: 1px solid $primary-color;
      }
    }
    .input-area {
      display: flex;
      .f-name-inner {
        input {
          border: 1px solid $lightGrey;
          border-radius: 4px;
          padding: 8px;
        }
      }
      .firstname {
        margin-right: 10px;
        position: relative;
        .message {
          position: absolute;
          top: -15px;
          left: 0px;
          font-size: $text-12;
          color: red;
        }
      }
      .lastname {
        margin-right: 10px;
        position: relative;
        .message {
          position: absolute;
          top: -15px;
          left: 0px;
          font-size: $text-12;
          color: red;
        }
      }
    }
    .f-age {
      position: relative;
      .f-age-inner {
        border: 1px solid $lightGrey;
        border-radius: 4px;
        padding: 8px;
      }
      .message {
        position: absolute;
        top: -15px;
        left: 70px;
        font-size: $text-12;
        color: red;
      }
    }
    .f-gender {
      #gender {
        width: 75px;
        height: 25px;
        border: 1px solid $darkGrey;
        border-radius: 4px;
        outline: none;
        background-color: $lightGrey;
        cursor: pointer;
      }
    }
  }
}
</style>
