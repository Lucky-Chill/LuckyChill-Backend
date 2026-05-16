const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Gachon Classroom Reservation API",
    version: "1.0.0",
    description: "가천대학교 컴퓨터공학과 강의실 대여 API"
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/classrooms/{classroomId}": {
      get: {
        summary: "강의실 정보 조회",
        tags: ["Classrooms"]
      }
    },
    "/classrooms/{classroomId}/unavailable-dates": {
      get: {
        summary: "월별 예약 불가 날짜 조회",
        tags: ["Classrooms"],
        parameters: [
          { name: "year", in: "query", required: true, schema: { type: "integer" } },
          { name: "month", in: "query", required: true, schema: { type: "integer" } }
        ]
      }
    },
    "/classrooms/{classroomId}/schedule": {
      get: {
        summary: "특정 날짜 시간표 조회",
        tags: ["Classrooms"],
        parameters: [
          { name: "date", in: "query", required: true, schema: { type: "string", format: "date" } }
        ]
      }
    },
    "/reservations": {
      post: {
        summary: "예약 신청 생성",
        tags: ["Reservations"],
        security: [{ bearerAuth: [] }]
      }
    },
    "/reservations/me": {
      get: {
        summary: "내 예약 신청 목록",
        tags: ["Reservations"],
        security: [{ bearerAuth: [] }]
      }
    },
    "/admin/reservations": {
      get: {
        summary: "관리자 예약 신청 목록",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "status", in: "query", schema: { type: "string", default: "PENDING" } }
        ]
      }
    },
    "/admin/reservations/{reservationId}/status": {
      patch: {
        summary: "관리자 예약 승인/반려",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }]
      }
    }
  }
};

module.exports = swaggerSpec;
