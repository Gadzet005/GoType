export const requestMock = {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
};

vi.mock("axios", async (importOriginal: any) => {
    const actual = await importOriginal();
    return {
        ...actual,
        default: {
            ...actual.default,
            create: vi.fn(() => ({
                ...actual.default.create(),
                post: requestMock.post,
                get: requestMock.get,
                patch: requestMock.patch,
                put: requestMock.put,
                delete: requestMock.delete,
            })),
        },
    };
});
