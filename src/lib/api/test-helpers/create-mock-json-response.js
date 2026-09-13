export function createMockJsonResponse(data, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(data),
  };
}
