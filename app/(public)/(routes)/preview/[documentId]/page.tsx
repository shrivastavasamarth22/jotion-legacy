"use client";

import { useMutation, useQuery } from "convex/react";

import { Cover } from "@/components/cover";
import { Footer } from "@/app/(public)/_components/Footer";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar } from "@/components/toolbar";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface DocumentIdPageProps {
    params: {
        documentId: Id<"documents">;
    };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
    const Editor = useMemo(
        () => dynamic(() => import("@/components/editor"), { ssr: false }),
        []
    );

    const document = useQuery(api.documents.getById, {
        documentId: params.documentId,
    });

    const update = useMutation(api.documents.update);

    const onChange = (content: string) => {
        update({
            id: params.documentId,
            content,
        });
    };

    if (document === undefined) {
        return (
            <div>
                <Cover.Skeleton />
                <div className="md:max-w-3xl lg:max-w-4xl mt-10">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="h-14 w-[50%]" />
                        <div className="flex items-center gap-x-2">
                            <Skeleton className="h-8 w-[5%]" />
                            <Skeleton className="h-8 w-[10%]" />
                            <Skeleton className="h-8 w-[8%]" />
                            <Skeleton className="h-8 w-[5%]" />
                            <Skeleton className="h-8 w-[10%]" />
                        </div>
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[40%]" />
                        <Skeleton className="h-4 w-[60%]" />
                    </div>
                </div>
            </div>
        );
    }

    if (document === null) {
        return <div>Not found</div>;
    }

    return (
        <div className="flex flex-col min-h-[100%]">
            <div className="dark:bg-[#1f1f1f] flex-grow">
                <Cover preview url={document.coverImage} />
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                    <Toolbar preview initialData={document} />
                    <Editor
                        editable={false}
                        onChange={onChange}
                        initialContent={document.content}
                    />
                </div>
            </div>
            <Footer 
                userName={document.userName}
                date={document._creationTime}
            />
        </div>
    );
};

export default DocumentIdPage;
