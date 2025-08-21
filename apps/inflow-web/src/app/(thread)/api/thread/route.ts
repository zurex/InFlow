import { threadService } from 'inflow/server/services/thread-service';
import { NextRequest } from 'next/server';


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const limitStr = searchParams.get('limit') || '10';
    const limit = parseInt(limitStr, 10);

    const page = searchParams.get('page') || '0';
    const offset = parseInt(page, 0) * limit;

    const threads = await threadService.getThreads({limit, offset});
    return Response.json(threads)
}