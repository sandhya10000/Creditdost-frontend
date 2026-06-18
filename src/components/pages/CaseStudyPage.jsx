import { useParams } from "react-router-dom";

const CaseStudyPage = () => {
  const { category } = useParams();

  return (
    <div>
      <h2>{category}</h2>
    </div>
  );
};

export default CaseStudyPage;
