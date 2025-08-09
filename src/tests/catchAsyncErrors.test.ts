import catchAsyncErrors from "../lib/catchAsyncErrors"

describe('catchAsyncErrors.ts', ()=>{
    it('Should call function passed', async()=>{
        const mockedFn = jest.fn(async (req, res, next) => {}) // mock async handler
        const mockedReq = {} as any
        const mockedRes = {} as any
        const mockedNext = jest.fn()

        catchAsyncErrors(mockedFn)(mockedReq, mockedRes, mockedNext)
        expect(mockedFn).toHaveBeenCalled()
    })
    it('should call res.status(500) when an error occurs', async () => {
    const mockedFn = jest.fn(async (req, res, next) => {
        throw new Error('Error occurred');
    });

    const mockedReq = {} as any;
    const mockedRes = {} as any;
    mockedRes.status = jest.fn().mockReturnThis();
    mockedRes.json = jest.fn();
    
    const mockedNext = jest.fn();

    await catchAsyncErrors(mockedFn)(mockedReq, mockedRes, mockedNext);

    expect(mockedRes.status).toHaveBeenCalledWith(500);
    });

})