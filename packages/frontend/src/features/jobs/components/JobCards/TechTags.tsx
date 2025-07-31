// // אחראית להציג תגיות של טכנולוגיות דרושות למשרה 
// import React from 'react';

// interface TechTagsProps {
//   requirements: string;
//   maxTags?: number;
// }

// const TechTags: React.FC<TechTagsProps> = ({ requirements, maxTags = 4 }) => {
// const techArray = requirements.split(',');
// const visibleTechs = techArray.slice(0, maxTags);
// const remainingCount = techArray.length - maxTags;
// return (
//     <div
//       style={{
//         display: 'flex',
//         flexWrap: 'wrap',
//         gap: '8px',
//         marginBottom: '16px',
//       }}
//     >
//       {visibleTechs.map((tech, index) => (
//         <span
//           key={index}
//           style={{
//             backgroundColor: '#f3f4f6',
//             color: '#374151',
//             padding: '4px 8px',
//             borderRadius: '4px',
//             fontSize: '12px',
//             fontWeight: 500,
//           }}
//         >
//           {tech.trim()}
//         </span>
//       ))}
//       {remainingCount > 0 && (
//         <span
//           style={{
//             color: '#9ca3af',
//             fontSize: '12px',
//             padding: '4px 8px',
//           }}
//         >
//           +{remainingCount}
//         </span>
//       )}
//     </div>
//   );
// };

// export default TechTags;


// אחראית להציג תגיות של טכנולוגיות דרושות למשרה 
import React from 'react';

interface TechTagsProps {
  requirements: string;
  maxTags?: number;
}

const TechTags: React.FC<TechTagsProps> = ({ requirements, maxTags = 4 }) => {
const techArray = requirements.split(',');
const visibleTechs = techArray.slice(0, maxTags);
const remainingCount = techArray.length - maxTags;
return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '16px',
      }}
    >
      {visibleTechs.map((tech, index) => (
        <span
          key={index}
          style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          {tech.trim()}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          style={{
            color: '#9ca3af',
            fontSize: '12px',
            padding: '4px 8px',
          }}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default TechTags;

