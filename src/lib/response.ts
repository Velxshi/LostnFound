export function successResponse(payload: any, message = 'Success') {
    return Response.json({
        success: true,
        message,
        ...payload,
    })
}

export function errorResponse(message = 'Error', status = 500) {
    return Response.json(
    {
        success: false,
        message,
    },
    { status }
    )
}