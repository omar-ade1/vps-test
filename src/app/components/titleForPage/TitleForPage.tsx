import React from "react";

interface Props {
  titleText: string;
}

const TitleForPage: React.FC<Props> = ({ titleText }) => {
  return <h2 className="text-3xl font-bold text-center p-6 text-white bg-blue-600 border rounded-xl w-fit mx-auto mb-5">{titleText}</h2>;
};

export default TitleForPage;
