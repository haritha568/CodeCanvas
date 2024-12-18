"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Plus } from "lucide-react";


interface NewBoardButtonProps {
    orgId: string;
    disabled?: boolean;
}



export const NewBoardButton = (
    {orgId,disabled,

    }: NewBoardButtonProps) => {
        const {mutate,pending} = useApiMutation(api.board.create)
        const onClick = () => {
           mutate ({
                orgId,
                title: "Untitled"
            })
            .then(()=>{
                toast.success("Board created")
            })
            .catch(()=>toast.error("Failed to create board"))
            }
        
    return (
        <button
        disabled={pending || disabled}
        onClick={onClick}
        className={cn("col-span-1 aspect-[100/127] bg-indigo-500 rounded-lg hover:bg-indigo-800 flex flex-col items-center justify-center py-6",
        (disabled || pending) && "opacity-75 hover:bg-indigo-500 cursor-not-allowed"
        )}
        >
            <div />
            <Plus className="h-12 w-12 text-white stroke-1"/>
            <p className="text-sm text-white font-light">New board</p>
        </button>
    )
}
