type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'head';

type MutableOpenApiDoc = {
  security?: Record<string, string[]>[];
  paths?: Record<
    string,
    Partial<Record<HttpMethod, { security?: Record<string, string[]>[] }>>
  >;
};

export function patchOpenApiDocument(doc: MutableOpenApiDoc): void {
  doc.security = [{ 'access-token': [] }];

  const paths = doc.paths;
  if (!paths) return;

  const setSecurity = (
    path: string,
    method: HttpMethod,
    security: Record<string, string[]>[],
  ) => {
    const op = paths[path]?.[method];
    if (op) {
      op.security = security;
    }
  };

  const noAuth: [string, HttpMethod][] = [
    ['/connection', 'get'],
    ['/health/live', 'get'],
    ['/health/ready', 'get'],
    ['/prisma', 'get'],
    ['/redis', 'get'],
    ['/stripe/webhook', 'post'],
    ['/auth/signup', 'post'],
    ['/auth/login', 'post'],
    ['/auth/google', 'get'],
    ['/auth/google/callback', 'get'],
  ];

  for (const [path, method] of noAuth) {
    setSecurity(path, method, []);
  }

  setSecurity('/auth/refresh', 'post', [{ refresh: [] }]);
}
