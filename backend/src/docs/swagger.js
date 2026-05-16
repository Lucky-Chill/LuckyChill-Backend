const EXAMPLE_CLASSROOM_ID = "11111111-1111-1111-1111-111111111101";

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Gachon Classroom Reservation API",
    version: "1.0.0",
    description: [
      "가천대학교 컴퓨터공학과 강의실 대여 API (MVP).",
      "",
      "- **인증**: Supabase Auth `access_token`을 `Authorization: Bearer` 헤더로 전달",
      "- **로그인**: 프론트에서 Supabase `signInWithOAuth` / `signInWithPassword` (백엔드 auth 라우트 없음)",
      "- **응답**: `{ success, data, error }` / 필드명 camelCase",
      "- **Health**: `GET http://localhost:3000/health` (이 문서 base URL 밖)"
    ].join("\n")
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local API"
    }
  ],
  tags: [
    { name: "Classrooms", description: "강의실·시간표 (인증 불필요)" },
    { name: "Reservations", description: "예약 신청 (로그인 필요)" },
    { name: "Admin", description: "관리자 (ADMIN role 필요)" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Supabase session access_token"
      }
    },
    schemas: {
      ApiSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "object" },
          error: { type: "object", nullable: true, example: null }
        }
      },
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          data: { type: "object", nullable: true, example: null },
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "BAD_REQUEST" },
              message: { type: "string", example: "에러 메시지" }
            }
          }
        }
      },
      Classroom: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "강의실 201" },
          floor: { type: "string", example: "2층" },
          capacity: { type: "integer", example: 30 },
          equipment: {
            type: "array",
            items: { type: "string" },
            example: ["빔프로젝터", "화이트보드"]
          },
          hasProjector: { type: "boolean" },
          hasComputer: { type: "boolean" }
        }
      },
      UnavailableDates: {
        type: "object",
        properties: {
          classroomId: { type: "string", format: "uuid" },
          year: { type: "integer", example: 2026 },
          month: { type: "integer", example: 5 },
          unavailableDates: {
            type: "array",
            items: { type: "string", format: "date" },
            example: ["2026-05-13"]
          }
        }
      },
      TimeSlot: {
        type: "object",
        properties: {
          startTime: { type: "string", example: "09:00" },
          endTime: { type: "string", example: "10:00" },
          status: {
            type: "string",
            enum: ["AVAILABLE", "UNAVAILABLE"]
          },
          reason: {
            type: "string",
            enum: ["CLASS", "RESERVATION", "PENDING"],
            nullable: true
          }
        }
      },
      DaySchedule: {
        type: "object",
        properties: {
          classroomId: { type: "string", format: "uuid" },
          date: { type: "string", format: "date", example: "2026-05-28" },
          timeSlots: {
            type: "array",
            items: { $ref: "#/components/schemas/TimeSlot" }
          }
        }
      },
      CreateReservationRequest: {
        type: "object",
        required: [
          "classroomId",
          "reservationDate",
          "startTime",
          "endTime",
          "title",
          "participantInfo",
          "eventType",
          "reason",
          "applicantName",
          "applicantDepartment",
          "applicantStudentId",
          "applicantPhone",
          "professorName",
          "professorPhone"
        ],
        properties: {
          classroomId: {
            type: "string",
            format: "uuid",
            example: EXAMPLE_CLASSROOM_ID
          },
          reservationDate: { type: "string", format: "date", example: "2026-05-28" },
          startTime: { type: "string", example: "14:00" },
          endTime: { type: "string", example: "16:00" },
          title: { type: "string", example: "알고리즘 스터디" },
          participantInfo: { type: "string", example: "교수 외 학생 10명" },
          eventType: {
            type: "string",
            enum: ["CLASS", "SELF_STUDY", "STUDY_GROUP", "ETC"]
          },
          eventTypeEtc: { type: "string", nullable: true },
          useProjector: { type: "boolean", default: false },
          useComputer: { type: "boolean", default: false },
          extraEquipment: { type: "string", default: "" },
          reason: { type: "string", example: "팀 프로젝트 회의" },
          applicantName: { type: "string" },
          applicantDepartment: { type: "string" },
          applicantStudentId: { type: "string" },
          applicantPhone: { type: "string" },
          professorName: { type: "string" },
          professorPhone: { type: "string" }
        }
      },
      CreateReservationResponse: {
        type: "object",
        properties: {
          reservationId: { type: "string", format: "uuid" },
          status: { type: "string", example: "PENDING" }
        }
      },
      MyReservationItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          classroomName: { type: "string" },
          reservationDate: { type: "string", format: "date" },
          startTime: { type: "string" },
          endTime: { type: "string" },
          title: { type: "string" },
          status: {
            type: "string",
            enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"]
          }
        }
      },
      AdminReservationItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          classroomName: { type: "string" },
          reservationDate: { type: "string", format: "date" },
          startTime: { type: "string" },
          endTime: { type: "string" },
          title: { type: "string" },
          applicantName: { type: "string" },
          applicantDepartment: { type: "string" },
          status: { type: "string" }
        }
      },
      UpdateReservationStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["APPROVED", "REJECTED", "CANCELLED"]
          },
          adminMemo: { type: "string", example: "예약 승인" }
        }
      }
    },
    parameters: {
      classroomId: {
        name: "classroomId",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
        example: EXAMPLE_CLASSROOM_ID
      },
      reservationId: {
        name: "reservationId",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" }
      }
    },
    responses: {
      BadRequest: {
        description: "요청값 오류",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" }
          }
        }
      },
      Unauthorized: {
        description: "로그인 필요 / 토큰 무효",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" }
          }
        }
      },
      Forbidden: {
        description: "권한 없음 (ADMIN 등)",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" }
          }
        }
      },
      NotFound: {
        description: "리소스 없음",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" }
          }
        }
      },
      Conflict: {
        description: "시간 겹침 등",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" }
          }
        }
      }
    }
  },
  paths: {
    "/classrooms/{classroomId}": {
      get: {
        tags: ["Classrooms"],
        summary: "강의실 정보 조회",
        parameters: [{ $ref: "#/components/parameters/classroomId" }],
        responses: {
          200: {
            description: "성공",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiSuccess" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Classroom" }
                      }
                    }
                  ]
                }
              }
            }
          },
          404: { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/classrooms/{classroomId}/unavailable-dates": {
      get: {
        tags: ["Classrooms"],
        summary: "월별 예약 불가 날짜",
        description: "달력에서 선택 불가한 날짜 목록",
        parameters: [
          { $ref: "#/components/parameters/classroomId" },
          {
            name: "year",
            in: "query",
            required: true,
            schema: { type: "integer", example: 2026 }
          },
          {
            name: "month",
            in: "query",
            required: true,
            schema: { type: "integer", minimum: 1, maximum: 12, example: 5 }
          }
        ],
        responses: {
          200: {
            description: "성공",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiSuccess" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/UnavailableDates" }
                      }
                    }
                  ]
                }
              }
            }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/classrooms/{classroomId}/schedule": {
      get: {
        tags: ["Classrooms"],
        summary: "특정 날짜 시간표",
        parameters: [
          { $ref: "#/components/parameters/classroomId" },
          {
            name: "date",
            in: "query",
            required: true,
            schema: { type: "string", format: "date", example: "2026-05-28" }
          }
        ],
        responses: {
          200: {
            description: "성공",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiSuccess" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/DaySchedule" }
                      }
                    }
                  ]
                }
              }
            }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/reservations": {
      post: {
        tags: ["Reservations"],
        summary: "예약 신청 생성",
        description: "화면1(일시·강의실) + 화면2(신청서) 필드를 합쳐 전송",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateReservationRequest" }
            }
          }
        },
        responses: {
          201: {
            description: "생성됨",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiSuccess" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          $ref: "#/components/schemas/CreateReservationResponse"
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          409: { $ref: "#/components/responses/Conflict" }
        }
      }
    },
    "/reservations/me": {
      get: {
        tags: ["Reservations"],
        summary: "내 예약 신청 목록",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "성공 (data는 배열)",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiSuccess" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/MyReservationItem" }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          401: { $ref: "#/components/responses/Unauthorized" }
        }
      }
    },
    "/admin/reservations": {
      get: {
        tags: ["Admin"],
        summary: "관리자 예약 목록",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
              default: "PENDING"
            }
          }
        ],
        responses: {
          200: {
            description: "성공 (data는 배열)",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiSuccess" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/AdminReservationItem"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" }
        }
      }
    },
    "/admin/reservations/{reservationId}/status": {
      patch: {
        tags: ["Admin"],
        summary: "예약 승인/반려/취소",
        description: "APPROVED 시 동일 시간대 겹치면 409",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/reservationId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateReservationStatusRequest"
              }
            }
          }
        },
        responses: {
          200: {
            description: "성공",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccess" }
              }
            }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          409: { $ref: "#/components/responses/Conflict" }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
