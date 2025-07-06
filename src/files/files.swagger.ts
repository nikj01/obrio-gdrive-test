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
      path: "/files",
      method: "POST",
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

export namespace GetFilesByUserResponses {
  export const response200 = {
    status: 200,
    description: "Files retrieved successfully",
    example: {
      files: [
        {
          id: "0197e14f-c92e-7bb1-95ca-f0f35d3d203b",
          originalUrl:
            "https://napoleoncat.com/wp-content/uploads/2022/05/social-media-memes-emotional-damage-meme.jpg",
          originalFilename: "social-media-memes-emotional-damage-meme.jpg",
          storageViewUrl:
            "https://drive.google.com/file/d/1Vn0ed1fa69DVzY1PgpKz-ufbQX42Dj8A/view?usp=drivesdk",
          storageDownloadUrl:
            "https://drive.google.com/uc?export=download&id=1Vn0ed1fa69DVzY1PgpKz-ufbQX42Dj8A",
        },
        {
          id: "0197e14f-c92e-7bb1-95ca-f109ee7864af",
          originalUrl:
            "https://drive.google.com/uc?export=download&id=1s1fgduIeC08Zwpis9w3a9SpoGfwHNcSF",
          originalFilename: "uc",
          storageViewUrl:
            "https://drive.google.com/file/d/1qPFdMPdlqp7hO0BUcoqFlda9dfanLcif/view?usp=drivesdk",
          storageDownloadUrl:
            "https://drive.google.com/uc?export=download&id=1qPFdMPdlqp7hO0BUcoqFlda9dfanLcif",
        },
        {
          id: "0197e14f-c92e-7bb1-95ca-f11c87e3f150",
          originalUrl:
            "https://download.virtualbox.org/virtualbox/7.1.10/VirtualBox-7.1-7.1.10_169112_fedora36-1.x86_64.rpm",
          originalFilename: "VirtualBox-7.1-7.1.10_169112_fedora36-1.x86_64.rpm",
          storageViewUrl:
            "https://drive.google.com/file/d/1UhLIfSKc62pmtLXPTE074_DR5GCo2IKV/view?usp=drivesdk",
          storageDownloadUrl:
            "https://drive.google.com/uc?export=download&id=1UhLIfSKc62pmtLXPTE074_DR5GCo2IKV",
        },
      ],
      pagination: {
        page: 1,
        limit: 3,
        count: 6,
        totalPages: 2,
        hasNextPage: true,
        hasPrevPage: false,
        exceedCount: false,
        exceedTotalPages: false,
      },
    },
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              originalUrl: { type: "string", format: "uri" },
              originalFilename: { type: "string" },
              storageViewUrl: { type: "string", format: "uri" },
              storageDownloadUrl: { type: "string", format: "uri" },
            },
          },
        },
        pagination: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            count: { type: "number" },
            totalPages: { type: "number" },
            hasNextPage: { type: "boolean" },
            hasPrevPage: { type: "boolean" },
            exceedCount: { type: "boolean" },
            exceedTotalPages: { type: "boolean" },
          },
        },
      },
    },
  };

  export const response404 = {
    status: 404,
    description: "Bad Request",
    example: {
      statusCode: 404,
      timestamp: "2025-07-07T00:01:17.386Z",
      path: "/files/user-0197df48-8629-78f2-a2471?page=1&limit=3",
      method: "GET",
      params: {
        id: "user-0197df48-8629-78f2-a2471",
      },
      query: {
        page: "1",
        limit: "3",
      },
      exception: {
        name: "HttpException",
        message:
          "Record not found: No files found for user with ID: user-0197df48-8629-78f2-a2471. Check if the user exists or has uploaded files.",
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
      timestamp: "2025-07-06T23:45:47.376Z",
      path: "/files/user-0197df48-8629-78f2-a250?page=1&limit=3",
      method: "GET",
      params: {
        id: "user-0197df48-8629-78f2-a247",
      },
      query: {
        page: "1",
        limit: "3",
      },
      exception: {
        name: "HttpException",
        message: 'Something went wrong: \nInvalid `"f").findMany()',
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
