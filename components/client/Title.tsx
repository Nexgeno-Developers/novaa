"use client";

interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  const words = title.split(" ");

  return (
    <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-gray-300 mb-4 uppercase">
      {words.map((word, index) => {
        // highlight only the 3rd word (index = 2)
        if (index === 2) {
          return (
            <span key={index} className="text-[#CDB04E]">
              {word}{" "}
            </span>
          );
        }
        return <span key={index}>{word} </span>;
      })}
    </h2>
  );
}