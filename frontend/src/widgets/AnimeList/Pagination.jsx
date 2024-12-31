'use client';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/shadcn-ui/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Paginations = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePageChange = (pageNumber) => {
        router.push(createPageURL(pageNumber));
    };

    return (
        <div className="sticky bottom-4 z-10 flex justify-center space-x-2 my-4">
            <Pagination className="bg-[#0B0B0B] w-fit p-5 rounded-[14px] border border-white/10">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                    {[1, 2, 3, 4, 5].map((pageNumber) => (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink 
                                onClick={() => handlePageChange(pageNumber)}
                                isActive={currentPage === pageNumber}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext 
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === 10 ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default Paginations;
