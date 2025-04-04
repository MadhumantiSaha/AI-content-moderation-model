import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
  } from "@/components/ui/table";
  import { CheckCircle, XCircle } from "lucide-react";
  
  interface ModerationLogEntry {
    type: string;
    username: string;
    date: string;
    time: string;
    action: string;
    caption: string;
    reason: string;
  }
  
  interface ModerationLogProps {
    entries: ModerationLogEntry[];
    caption?: string; // Optional caption prop
  }
  
  export function ModerationLog({ entries, caption }: ModerationLogProps) {
    return (
      <div className="w-full">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Caption</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{entry.type}</TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell>
                  {entry.date} <br /> {entry.time}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {entry.action === "Approved" ? (
                      <>
                        <CheckCircle className="text-green-500 h-4 w-4" />
                        <span className="text-green-500">Approved</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-500 h-4 w-4" />
                        <span className="text-red-500">Rejected</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>{entry.caption}</TableCell>
                <TableCell>{entry.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }