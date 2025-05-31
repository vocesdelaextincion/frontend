import React, { useState } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";

interface TableItem {
  id: string | number;
  name: string;
  date: string;
  audioPath: string;
  [key: string]: unknown;
}

interface RecordingsTableProps {
  data: TableItem[];
  renderExpandedContent?: (item: TableItem) => React.ReactNode;
}

interface ExpandableRowProps {
  item: TableItem;
  renderExpandedContent?: (item: TableItem) => React.ReactNode;
}

const TableRow = ({ item }: ExpandableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={`flex flex-row items-center justify-between w-full bg-primary-200  text-gray-950 text-sm cursor-pointer hover:bg-primary-300 transition-colors`}
        onClick={toggleExpand}
      >
        <span className="flex flex-col items-center justify-center w-50 py-3">
          {item.name}
        </span>
        <span className="flex flex-col items-center justify-center w-full">
          {item.date}
        </span>
        <span className="flex items-center justify-center w-20">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>
      {isExpanded && (
        <div className="w-full p-4 bg-primary-100">
          <figure className="flex justify-center items-center w-full">
            <audio controls src={item.audioPath}></audio>
          </figure>
        </div>
      )}
    </div>
  );
};

const RecordingsTable = ({
  data,
  renderExpandedContent,
}: RecordingsTableProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">No data available</div>
    );
  }

  return (
    <div className="flex flex-col items-stretch justify-start w-full gap-1">
      {data.map((item) => (
        <TableRow
          key={item.id}
          item={item}
          renderExpandedContent={renderExpandedContent}
        />
      ))}
    </div>
  );
};

export default RecordingsTable;
