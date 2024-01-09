export const MessageResponse = {
  COMMON: {
    UPDATE_EMPTY_OBJECT: "Please fill in the information field you want to change"
  },

  USER: {
    NOT_FOUND(id: number) {
      return `User with id ${id} not found`;
    },
    EXIST: 'User exist!',
    NOT_EXIST: 'User not exist!',
  },

  AUTH: {
    WRONG_ACCOUNT: 'Email or password not true',
    LOG_OUT_SUCCESS: 'Logout successfully',
  },

  HELICOPTER: {
    EXIST: 'Helicopter exist!',
    NOT_EXIST: 'Helicopter not exist!',
    CREATE_SUCCESS: 'Create new helicopter successfully!',
    UPDATE_SUCCESS: 'Update helicopter successfully',
    GET_DETAIL_SUCCESS: 'Get detail helicopter successfully',
    GET_LIST_SUCCESS: 'Get list helicopter successfully',
    DELETE_SUCCESS: 'Delete helicopter successfully',
  },

  ROUTE: {
    CREATE_SUCCESS: 'Create flight route successfully!',
    NOT_EXIST: 'Flight route not exist!',
    UPDATE_SUCCESS: 'Update flight route successfully',
    GET_DETAIL_SUCCESS: 'Get detail flight route successfully',
    GET_LIST_SUCCESS: 'Get list flight route successfully',
    DELETE_SUCCESS: 'Delete flight route successfully',
  },
};
