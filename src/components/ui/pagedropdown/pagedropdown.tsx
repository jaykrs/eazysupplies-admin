"use client";
import React, { useState } from "react";
import OptionItem from "../optionpage/OptionItem";

interface Option {
  icon: string;
  name: string;
  author?: string;
  pagepath?: string;
  type?: string;
  published?: boolean;
  headerfooterid?: number;
  clientsidelibs?: string;
  onClick: () => void;
}
interface tableName {
  T1?: string;
  T2?: string;
  T3?: string;
  T4?: string;
  T5?: string;
  T6?: string;
  T7?: string;
  T8?: string;
}

interface PageDropdownProps {
  options: Option[];
  tableNames: tableName;
}

function PageDropdown({ options, tableNames }: PageDropdownProps) {
  const [selected, setSelected] = useState<string>("");


  if (!options || options.length === 0) return null;

  return (
    <div className=" shadow bg-white dark:bg-gray-900 overflow-hidden">
      {/* ✅ Static Header Here */}
      <div className="flex items-center justify-between font-semibold text-gray-500 text-sm border-b py-4   dark:text-gray-400">
        <div className="w-1/5 ps-4">{tableNames.T1}</div>
        <div className="w-1/5">{tableNames.T2}</div>
        <div className="w-1/5">{tableNames.T3}</div>
        <div className="w-1/5">{tableNames.T4}</div>
        <div className="w-1/5">{tableNames.T5}</div>
        <div className="w-1/5">{tableNames.T6}</div>
        <div className="w-1/5">{tableNames.T7}</div>
        {tableNames.T8 ? <div className="w-1/5">{tableNames.T8}</div> : null}
      </div>

      {/* ✅ Dynamic Rows */}
      {options.map((opt, idx) => (
        <OptionItem
          key={idx}
          icon={opt.icon}
          name={opt.name}
          author={opt.author}
          pagepath={opt.pagepath ?? ""}
          type={opt.type}
          published={opt.published }
          headerfooterId={opt.headerfooterid}
          clientsidelibs={opt.clientsidelibs}
          onClick={opt.onClick}
        />
      ))}
    </div>
  );
}

export default PageDropdown;
