import { threadService } from 'inflow/server/services/thread-service';
import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const threads = await threadService.getThreadWithDetails(id);
    return Response.json(threads)
}