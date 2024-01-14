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
    CUSTOMER_NOT_EXIST: 'Customer not exist!',
    PILOT_NOT_EXIST: 'Pilot not exist!',
    TOUR_GUIDE_NOT_EXIST: 'Tour guide not exist!',
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

  WORK_SCHEDULE: {
    CREATE_SUCCESS: 'Create work schedule time time successfully!',
    ERROR_DATE: 'Must fill in start and end times',
    NOT_EXIST: 'Work schedule time not exist!',
    NOT_EXIST_WITH_USER(workScheduleId: number, userId: number) {
      return `Work schedule time have id ${workScheduleId} not found with user id ${userId}!`;
    },
    UPDATE_SUCCESS: 'Update work schedule time successfully',
    GET_LIST_SUCCESS: 'Get list work schedule time successfully',
    GET_DETAIL_SUCCESS: 'Get detail work schedule time successfully',
    DELETE_SUCCESS: 'Delete work schedule time successfully',
    REQUEST_UPDATE_NOT_EXIST: 'Request update work schedule not exist',
    REQUEST_UPDATE_SUCCESS:
      'Request update work schedule time successfully, please wait for an admin to process',
    Resolve_UPDATE_SUCCESS: 'Resolve update work schedule time successfully',
    EXPIRED_DATE_REQUEST_UPDATE:
      'The time to update the work schedule has expired',
  },

  FLIGHT_SCHEDULE: {
    EXCEED_NUMBER: 'Exceed the number of helicopters flying at the same time',
    PILOT_IN_PROCESS(id: number) {
      return `The pilot is on another flight with id ${id}`;
    },
    TOUR_GUIDE_IN_PROCESS(id: number) {
      return `The tour guide is on another flight ${id}`;
    },
    HELICOPTER_IN_PROCESS(id: number) {
      return `The helicopter is on another flight ${id}`;
    },
    CREATE_SUCCESS: 'Create flight schedule time time successfully!',
  },
};
