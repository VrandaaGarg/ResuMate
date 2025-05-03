import React from 'react';

const companies = [
  { name: 'Google', color: '#4285F4', logo: '/logos/Google.png' },
  { name: 'Amazon', color: '#FF9900', logo: '/logos/amazon.png' },
  { name: 'Microsoft', color: '#737373', logo: '/logos/microsoft.png' },
//   { name: 'TCS', color: '#f47721', logo: '/logos/tcs.png' },
  { name: 'Wipro', color: '#7f3f98', logo: '/logos/wipro.webp' },
//   { name: 'Adobe', color: '#FF0000', logo: '/logos/adobe.png' },
  { name: 'Netflix', color: '#E50914', logo: '/logos/netflix.png' },
  { name: 'Meta', color: '#1877F2', logo: '/logos/meta.png' },
  { name: 'IBM', color: '#006699', logo: '/logos/Ibm.png' },
//   { name: 'Infosys', color: '#007CC3', logo: '/logos/infosys.png' },
  { name: 'Salesforce', color: '#00A1E0', logo: '/logos/SalesForce.png' },
];

const Companies = () => {
  return (
    <section className="py-10 px-6 md:px-20 bg-sky-800/10">
      <h2 className="text-3xl text-center mb-20 [font-family:'Lilita_One',cursive]">
        Our Resumes Got Users Into
      </h2>

      <div className=" relative w-full">
        <div className="marquee-track flex gap-12 w-max">
          {[...companies, ...companies].map((company, i) => (
            <div
              key={i}
              className="flex flex-col items-center min-w-[120px] transition transform hover:scale-105"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-5 w-auto mb-2"
                loading="lazy"
              />
              {/* <p
                className="text-sm font-semibold"
                style={{ color: company.color }}
              >
                {company.name}
              </p> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;
