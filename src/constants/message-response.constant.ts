export const MessageResponse = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',

  USER: {
    NOT_FOUND(id: number) {
      return `User with id ${id} not found`;
    },
    EXIST: 'User exist!',
  },
  AUTH: {
    WRONG_ACCOUNT: 'Email or password not true',
    LOG_OUT_SUCCESS: 'Logout successfully',
  },
  HELICOPTER: {
    CREATE_SUCCESS: 'Create new helicopter successfully!',
  },
};
