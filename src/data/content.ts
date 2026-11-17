/**
 * Published school content, lightly edited for spelling and grammar only.
 * Sources: gulfflowerschool.com (/, /modal.html, /admission.html, /admissionpre.html).
 */
import { photos, people } from './photos';

/* ------------------------------------------------------------------ */
/* Stages — admissionpre.html (ages) and admission.html (secondary)    */
/* ------------------------------------------------------------------ */
export const stages = [
  {
    id: 'pre-age',
    name: 'Pre-age',
    classes: ['Pre-age A: under 2 years', 'Pre-age B: 2–3 years'],
    ages: 'Under 2 – 3 years',
    campus: 'Gulf Flower One',
    note: 'A gentle first step away from home, with Montessori-inspired early learning.',
    photo: photos.primaryCastleSlide,
    href: '/schools/nursery-primary/',
  },
  {
    id: 'nursery',
    name: 'Nursery',
    classes: ['Nursery I: 3–4 years', 'Nursery II: 4–5 years'],
    ages: '3 – 5 years',
    campus: 'Gulf Flower One',
    note: 'Jolly Phonics and Montessori packages alongside the Federal curriculum.',
    photo: photos.primaryMuralWall,
    href: '/schools/nursery-primary/',
  },
  {
    id: 'lower-primary',
    name: 'Lower Primary',
    classes: ['Basic 1: 5–6 years', 'Basic 2: 6–7 years', 'Basic 3: 7–8 years'],
    ages: '5 – 8 years',
    campus: 'Gulf Flower One',
    note: 'Air-conditioned classrooms and a broad, balanced foundation.',
    photo: photos.primaryCourtyardSlide,
    href: '/schools/nursery-primary/',
  },
  {
    id: 'upper-primary',
    name: 'Upper Primary',
    classes: ['Basic 4: 8–9 years', 'Basic 5: 9–10 years', 'Basic 6: 10–11 years'],
    ages: '8 – 11 years',
    campus: 'Gulf Flower One',
    note: 'Pupils have recorded success in the State Entrance and Federal Common Entrance examinations.',
    photo: photos.coveredPlayHall,
    href: '/schools/nursery-primary/',
  },
  {
    id: 'junior-secondary',
    name: 'Junior Secondary',
    classes: ['JSS1 – JSS3 (Basic 7–9)'],
    ages: 'JSS1 – JSS3',
    campus: 'Gulf Flower Two',
    note: 'Sixteen-plus subjects, from Basic Science and French to Fine Art and Music.',
    photo: photos.labFunnel,
    href: '/schools/high-school/',
  },
  {
    id: 'senior-secondary',
    name: 'Senior Secondary',
    classes: ['SS1 – SS3'],
    ages: 'SS1 – SS3',
    campus: 'Gulf Flower Two',
    note: 'Science, commercial and arts subjects, preparing students for WASSCE.',
    photo: photos.labTitration,
    href: '/schools/high-school/',
  },
] as const;

/* ------------------------------------------------------------------ */
/* Facilities — modal.html #sf and admissionpre.html #fac             */
/* ------------------------------------------------------------------ */
export const facilities = [
  'Fully equipped science laboratory',
  'ICT studio with modern computers and internet',
  'Music studio with diverse musical instruments',
  'Creative art studio',
  'Introductory Technology workshop',
  'Home Economics food and nutrition kitchen',
  'Robotics studio',
  'Accounting clinic for commercial students',
  'Sick bay with school nurses',
  'Multi-purpose hall',
  'Boarding section',
  'School cafeteria',
  'Children’s playground',
  'Sports centre',
  'Fleet of school buses',
];

export const primaryFacilities = [
  'Air-conditioned classrooms',
  '45 KVA power generating plant',
  'A spacious playground with recreational equipment',
  'Modern air-conditioned school buses',
];

/** Facilities we can show with a matching photograph. */
export const facilityFeatures = [
  { title: 'Science laboratory', text: 'Practical work is part of learning, from titrations to filtration, in a fully equipped lab.', photo: photos.labGroup },
  { title: 'Playgrounds', text: 'A spacious playground with recreational equipment for our youngest learners.', photo: photos.primaryCastleSlide },
  { title: 'Boarding house', text: 'A home away from home for boarders at primary and secondary level.', photo: photos.boardingDormitory },
  { title: 'School buses', text: 'A fleet of branded school buses; the primary school’s buses are air-conditioned.', photo: photos.busesHighSchool },
  { title: 'Safety & security', text: 'Security is taken seriously, with uniformed security personnel on site.', photo: photos.securityAssembly },
];

/* ------------------------------------------------------------------ */
/* Extra-curricular — Head Teacher, admissionpre.html, modal.html     */
/* ------------------------------------------------------------------ */
export const activities = [
  'Basketball', 'Ballet', 'Taekwondo', 'Swimming', 'Track & field', 'Literary & debating',
  'Press club', 'Music club', 'Cultural day', 'Choreography', 'Show-and-tell', 'Excursions',
  'Inter-school competitions', 'Academic clinics',
];

/* ------------------------------------------------------------------ */
/* High school — admission.html                                        */
/* ------------------------------------------------------------------ */
export const jssSubjects = [
  'Mathematics', 'English Language', 'Yoruba Language', 'Computer Studies', 'Social Studies',
  'Civic Education', 'Music', 'French', 'Basic Technology', 'Basic Science', 'Home Economics',
  'Business Studies', 'Fine Art', 'Agricultural Science', 'Physical & Health Education',
  'Christian Religious Knowledge',
];

export const sssSubjects = [
  'Mathematics', 'English Language', 'Yoruba Language', 'Biology', 'Physics', 'Chemistry',
  'Geography', 'Computer Studies', 'Accounting', 'Commerce', 'Technical Drawing',
  'Agricultural Science', 'Christian Religious Knowledge', 'Food & Nutrition', 'Economics',
  'Further Mathematics', 'Government',
];

export const sssElectives = ['Data Processing', 'Dyeing & Bleaching', 'Book Keeping'];

export const jssGrading = [
  ['80 – 100', 'Excellence'],
  ['70 – 79', 'Very Good'],
  ['60 – 69', 'Good'],
  ['55 – 59', 'Average'],
  ['50 – 54', 'Pass'],
  ['Below 50', 'Fail'],
];

export const sssGrading = [
  ['80 – 100', 'A1', 'Excellence'],
  ['70 – 79', 'B2', 'Very Good'],
  ['65 – 69', 'B3', 'Good'],
  ['60 – 64', 'C4', 'Good'],
  ['55 – 59', 'C5', 'Average'],
  ['50 – 54', 'C6', 'Pass'],
  ['45 – 49', 'D7', 'Fail'],
  ['40 – 44', 'E8', 'Fail'],
  ['0 – 39', 'F9', 'Fail'],
];

export const entranceSubjects = [
  'Mathematics', 'English Language', 'Verbal reasoning', 'Quantitative reasoning',
  'Vocational aptitude', 'General studies',
];

export const diningRules = [
  'Obey every bell inviting you for a meal or dismissal after a meal.',
  'Every student must be present in the dining hall during every meal.',
  'Do not talk while eating.',
  'The dining hall must be kept clean at all times.',
  'No student should be found in the dining hall after 7:25am.',
];

export const scholarships = [
  { title: 'Best graduating learner', detail: 'from Primary 6' },
  { title: 'Best graduating student', detail: 'from SS3' },
  { title: 'Board of Directors’ Scholarship', detail: 'for an indigent student from the community' },
];

/* ------------------------------------------------------------------ */
/* Leadership — homepage speech modals                                 */
/* ------------------------------------------------------------------ */
export const leaders = [
  {
    id: 'director',
    name: 'Dr. Cynthia Gregg',
    role: 'Director, Gulf Flower Schools',
    photo: people.director,
    portrait: people.directorPortrait,
    pull: 'We are dedicated to building the totality of a child from cradle to adulthood.',
    title: 'A warm welcome to Gulf Flower Schools',
    message: [
      'Welcome to Gulf Flower Schools, where we nurture humanity through the provision of sound education. We are dedicated to building the totality of a child from cradle to adulthood.',
      'From 1998 and still counting — over two decades — we have been transforming lives through the total development of children: academically, socially, creatively, mentally, psychologically, physically, spiritually, morally and intellectually.',
      'Today, Gulf Flower Schools is a one-stop centre for all learners from pre-school to primary to high school, both day and boarding. We stand as the only boarding school in Oworonshoki, with annexes within the State.',
      'We inspire humanity with all-round quality education, which has ranked us among the best schools in Lagos State, within Kosofe LGA.',
      'We welcome you to be part of our inspiration.',
    ],
  },
  {
    id: 'principal',
    name: 'Mr. Femi Famuwagun',
    role: 'High School Principal',
    photo: people.principal,
    pull: 'A school that creates the paths of success and a bright future for young minds.',
    title: 'Welcome to Gulf Flower Schools',
    message: [
      'Do you desire to raise a child with high moral standards? Join us in promoting and moulding dedication and diligence into the minds of our young people — as the saying goes, “catch them young”.',
      'With almost three decades of experience in the education sector, Gulf Flower Schools operates both day and boarding systems. Our ethos of humility, simplicity and modesty, instilled in our training culture, has produced balanced families with accomplished goals, at home and abroad.',
      'Our staff members, both teaching and non-teaching, are trained professionals with dedication and commitment to the core.',
      'We welcome you to a school commissioned by God to provide friendly and fatherly service to humanity — a school that creates the paths of success and a bright future for young minds, in a success-centred citadel of learning.',
    ],
  },
  {
    id: 'head-teacher',
    name: 'Mrs. Omotayo Atode',
    role: 'Head Teacher, Primary School',
    photo: people.headTeacher,
    pull: 'We make learning irresistible, enabling children of all abilities to fly.',
    title: 'Welcome to Gulf Flower Schools',
    message: [
      'At Gulf Flower International Schools Limited, we are committed to developing children as a whole, providing an exciting and challenging environment where all children can achieve their potential. We provide a broad and balanced education within a happy, stimulating and healthy environment, and make learning irresistible, enabling children of all abilities to fly. Our learners feel safe to develop creatively and academically.',
      'Our use of the British and Nigerian curricula, blended with the Montessori approach, has helped us achieve an excellent academic standard, alongside friendly and committed staff and good moral values.',
      'Gulf Flower pupils have recorded many successes in academic and non-academic programmes at State and Federal levels — in the State Entrance Examination, the Federal Common Entrance Examination and inter-school competitions — proving that the school is equipped with qualified, dedicated and experienced teachers.',
      'Our extra-curricular activities make the school a home away from home, as we work towards producing educationally sound pupils for future challenges. They include basketball, ballet, taekwondo, literary and debating, music and more.',
      'We assure you of quality service as you register your ward(s) with us.',
    ],
  },
  {
    id: 'vp-admin',
    name: 'Mr. Balogun Wasiu Olaolu',
    role: 'Vice Principal (Administration)',
    photo: people.vpAdmin,
    pull: 'We inspire and groom students to be self-reliant, honest citizens.',
    title: 'Welcome to Gulf Flower Schools',
    message: [
      'Gulf Flower High School is a citadel of learning of 25 years, envisioned to raise great leaders capable of contributing immensely to the nation’s intellectual bank.',
      'We instil in our students the fear of God and respect for others. We inspire and groom them to be self-reliant, honest citizens who appreciate the dignity in labour. This has earned Gulf Flower High School a place among the frontrunners in its environs and in Lagos State at large.',
      'Join us today.',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* FAQs — every answer restates published information                  */
/* ------------------------------------------------------------------ */
export const faqs = [
  {
    q: 'What ages and classes do you admit?',
    a: 'We admit children from Pre-age (under 2 years) through Nursery I–II and Basic 1–6 at Gulf Flower One, and JSS1 to SS3 at Gulf Flower High School (Gulf Flower Two).',
  },
  {
    q: 'How does admission into the nursery and primary school work?',
    a: 'A placement test is conducted before a child is admitted into a class. All tests are conducted in English, so prospective pupils need an adequate knowledge of the language.',
  },
  {
    q: 'How does admission into JSS1 work?',
    a: 'Candidates sit an entrance examination drawn from the primary school scheme of work, covering Mathematics, English Language, verbal reasoning, quantitative reasoning, vocational aptitude and general studies. Successful candidates are then interviewed and admitted.',
  },
  {
    q: 'Can my child join a later secondary class?',
    a: 'Yes. Admission is offered into all other Junior and Senior Secondary classes, following a screening test.',
  },
  {
    q: 'Do you offer boarding?',
    a: 'Yes. The school operates a boarding system at both primary and secondary levels. Meals are carefully and nutritionally prepared by a team of professionals, and management pays close attention to the welfare and health of boarders.',
  },
  {
    q: 'Which curriculum do you follow?',
    a: 'We use the curriculum recommended by the Federal Ministry of Education, with formative elements from the British curriculum. In the early years this is complemented by Jolly Phonics and Montessori packages.',
  },
  {
    q: 'How large are the classes?',
    a: 'High school classrooms are designed to accommodate 25 students, which supports good classroom management.',
  },
  {
    q: 'How are students assessed?',
    a: 'Continuous assessment (projects, assignments, class tests, practical work and oral tests) makes up 40% of each term’s result and the examination 60%. Mid-term results are handed to parents on the termly open day, and promotional examinations hold at the end of the third term.',
  },
  {
    q: 'Do you offer scholarships?',
    a: 'Yes. Scholarships are awarded to the best graduating learner from Primary 6, the best graduating student from SS3, and — through the Board of Directors’ Scholarship — an indigent student from the community.',
  },
  {
    q: 'Where can I buy the uniform?',
    a: 'The school uniform and sportswear are available for purchase in school. Sportswear is worn on Wednesdays.',
  },
  {
    q: 'What are the school fees?',
    a: 'Fees are not published online. Please call the school or send an admission enquiry and the admissions team will share the current fees with you.',
  },
];
