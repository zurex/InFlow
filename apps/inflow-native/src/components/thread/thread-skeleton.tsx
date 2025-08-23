'use dom';
import '../../global.css';
import { Skeleton } from '../ui/skeleton';

export default function ThreadSkeleton() {
    return (
        <div className="flex flex-1 flex-col min-w-0 h-dvh">
            <div 
                className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative"
                style={{ paddingBottom: 20, paddingLeft: 16, paddingRight: 16 }}
            >
                <Skeleton className="h-[105px] w-full rounded-xl" />
                <Skeleton className="h-[85px] w-8/12 rounded-xl" />
                <Skeleton className="h-[185px] w-full rounded-xl" />
                <Skeleton className="h-[85px] w-10/12 rounded-xl" />
                <Skeleton className="h-[85px] w-full rounded-xl" />
            </div>
        </div>
    )
}