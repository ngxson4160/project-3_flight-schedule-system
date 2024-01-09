export const MessageResponse = {
  COMMON: {
    UPDATE_EMPTY_OBJECT:
      'Please fill in the information field you want to change',
    INVALID_HOUR_MINUS_FORMAT: 'Invalid time format. Use HH:mm.',
    INVALID_TIME_START_AND_END: 'Invalid time start and end',
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

  ADVENTURE_OPERATING_TIME: {
    CREATE_SUCCESS: 'Create adventure operating time time successfully!',
    ERROR_DATE: 'Must fill in start and end times',
    NOT_EXIST: 'Adventure operating time time not exist!',
    UPDATE_SUCCESS: 'Update adventure operating time successfully',
    GET_LIST_SUCCESS: 'Get list adventure operating time successfully',
    DELETE_SUCCESS: 'Delete adventure operating time successfully',
  },
};
