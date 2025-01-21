export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Username must be at least 5 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display name must not be empty",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password name must not be empty",
    },
    isLength: {
      options: {
        min: 8,
        max: 15,
      },
      errorMessage: "Password must have 8-15 characters",
    },
  },
};

export const queryParamsValidationSchema = {
  filter: {
    isString: true,
    optional: true,
    notEmpty: {
      errorMessage: "Must not be empty",
    },
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "Must be at least 3-10 characters",
    },
  },
};
