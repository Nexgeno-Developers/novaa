"use client";

interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  const parts = title.split(",");

  return (
    <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-gray-300 mb-4 uppercase">
      {parts.map((part, index) => {
        // highlight text after comma (index > 0)
        if (index > 0) {
          return (
            <span key={index} className="text-[#CDB04E] italic">
              ,{part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </h2>
  );
}
