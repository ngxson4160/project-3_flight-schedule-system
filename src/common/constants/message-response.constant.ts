export const MessageResponse = {
  COMMON: {
    UPDATE_EMPTY_OBJECT:
      'Please fill in the information field you want to change',
    INVALID_HOUR_MINUS_FORMAT: 'Invalid time format. Use HH:mm.',
    INVALID_TIME_START_AND_END: 'Invalid time start and end',
    GET_LIST_AVAILABLE_RESOURCE_SUCCESS:
      'Get list available resource successfully',
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
    EXCEED_CAPACITY: "Exceeds the helicopter's capacity",
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
    EXIST: 'Adventure operating time exist!',
    CREATE_SUCCESS: 'Create adventure operating time time successfully!',
    ERROR_DATE: 'Must fill in start and end times',
    NOT_EXIST: 'Adventure operating time not exist!',
    UPDATE_SUCCESS: 'Update adventure operating time successfully',
    GET_LIST_SUCCESS: 'Get list adventure operating time successfully',
    DELETE_SUCCESS: 'Delete adventure operating time successfully',
    OUTSIDE_OF_OPERATING_HOURS: 'Outside the operating time range',
  },

  WORK_SCHEDULE: {
    EXIST: 'Work schedule exist!',
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
    PILOT_OUTSIDE_OF_OPERATING_HOURS:
      'Outside the operating time range of pilot',
    TOUR_GUIDE_OUTSIDE_OF_OPERATING_HOURS:
      'Outside the operating time range of tour guide',
  },

  FLIGHT_SCHEDULE: {
    NOT_EXIST: 'Flight schedule not exist!',
    NOT_EXIST_REQUEST_HIRE: 'Request hire helicopter not exist!',
    EXCEED_NUMBER: 'Exceed the number of helicopters flying at the same time',
    EXCEED_NUMBER_SAME_ROUTE:
      'Exceeding the number of helicopters flying on the same route at the same time',
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
    CANCEL_SUCCESS: 'Cancel flight schedule time time successfully!',
    FLIGHT_NOT_BELONG_TO_USER: 'Flight schedule not belong to custom!',
    INVALID_TIME_CANCEL:
      'Cancellation time exceeded (can only be canceled within 1 hour)!',
    RESOLVE_HIRE_SUCCESS: 'Resolve hire helicopter successfully',
    INVALID_RESOLVE_HIRE_PRICE:
      'Prices cannot be added when helicopter rentals are not accepted',
  },
};
