
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatePostButtonProps {
  onClick: () => void;
  className?: string;
}

const CreatePostButton = ({ onClick, className }: CreatePostButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg p-0 animate-slide-up",
        className
      )}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default CreatePostButton;
