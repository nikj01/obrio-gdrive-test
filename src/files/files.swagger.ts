export namespace UploadFilesResponses {
  export const response201 = {
    status: 201,
    description: "Files uploaded successfully",
  };

  export const response400 = {
    status: 400,
    description: "Bad Request",
    example: {
      statusCode: 400,
      timestamp: "2025-07-06T19:49:03.357Z",
      path: "/files",
      method: "POST",
      params: {},
      query: {},
      exception: {
        name: "BadRequestException",
        message:
          "Each file URL must be a valid URL. Each file URL must not be an empty string.",
      },
    },
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        timestamp: { type: "string", format: "date-time" },
        path: { type: "string" },
        method: { type: "string" },
        params: { type: "object" },
        query: { type: "object" },
        exception: {
          type: "object",
          properties: {
            name: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
  };

  export const response500 = {
    status: 500,
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      timestamp: "2025-07-06T19:49:03.357Z",
      path: "/people",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "InternalServerError",
        message: "Internal Server Error",
      },
    },
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        timestamp: { type: "string", format: "date-time" },
        path: { type: "string" },
        method: { type: "string" },
        params: { type: "object" },
        query: { type: "object" },
        exception: {
          type: "object",
          properties: {
            name: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
  };
}
