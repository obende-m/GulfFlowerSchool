import type { ImageMetadata } from 'astro';

import primaryCourtyard from '@/assets/photos/primary-courtyard.jpg';
import primaryPlaygroundSlide from '@/assets/photos/primary-playground-slide.jpg';
import primaryCastleSlide from '@/assets/photos/primary-castle-slide.jpg';
import primaryGreenStairs from '@/assets/photos/primary-green-stairs.jpg';
import primaryCourtyardSlide from '@/assets/photos/primary-courtyard-slide.jpg';
import primaryMuralWall from '@/assets/photos/primary-mural-wall.jpg';
import labTitration from '@/assets/photos/lab-titration.jpg';
import labPractical from '@/assets/photos/lab-practical.jpg';
import labFunnel from '@/assets/photos/lab-funnel.jpg';
import labGroup from '@/assets/photos/lab-group.jpg';
import highSchoolCampus from '@/assets/photos/high-school-campus.jpg';
import highSchoolArch from '@/assets/photos/high-school-arch.jpg';
import busesHighSchool from '@/assets/photos/buses-high-school.jpg';
import busesCourtyard from '@/assets/photos/buses-courtyard.jpg';
import boardersGroup from '@/assets/photos/boarders-group.jpg';
import boardingDormitory from '@/assets/photos/boarding-dormitory.jpg';
import securityAssembly from '@/assets/photos/security-assembly.jpg';
import securityOfficers from '@/assets/photos/security-officers.jpg';
import campusWalkway from '@/assets/photos/campus-walkway.jpg';
import coveredPlayHall from '@/assets/photos/covered-play-hall.jpg';
import graduate1 from '@/assets/photos/graduate-1.jpg';
import graduate2 from '@/assets/photos/graduate-2.jpg';
import graduate3 from '@/assets/photos/graduate-3.jpg';
import graduate4 from '@/assets/photos/graduate-4.jpg';
import graduate5 from '@/assets/photos/graduate-5.jpg';

import director from '@/assets/people/director.jpg';
import directorPortrait from '@/assets/people/director-portrait.jpg';
import principal from '@/assets/people/principal.jpg';
import headTeacher from '@/assets/people/head-teacher.jpg';
import vpAdmin from '@/assets/people/vp-admin.jpg';

export type Photo = { src: ImageMetadata; alt: string };

/** Every photograph comes from gulfflowerschool.com. Alt text describes what is visible. */
export const photos = {
  primaryCourtyard: { src: primaryCourtyard, alt: 'Pupils in blue checked uniforms crossing the primary school courtyard, with school bags hung along the painted green and yellow classroom walls' },
  primaryPlaygroundSlide: { src: primaryPlaygroundSlide, alt: 'The primary school courtyard with its red play slide and pupils at break time' },
  primaryCastleSlide: { src: primaryCastleSlide, alt: 'Young pupils playing beside a castle-style slide in the primary playground' },
  primaryGreenStairs: { src: primaryGreenStairs, alt: 'Primary school courtyard with a bright green staircase, play slide and two floors of classrooms' },
  primaryCourtyardSlide: { src: primaryCourtyardSlide, alt: 'Pupils in the primary courtyard next to the green staircase and red slide' },
  primaryMuralWall: { src: primaryMuralWall, alt: 'Painted mural wall at the primary school with a sun, trees and the words “Play and Grow Together”' },
  labTitration: { src: labTitration, alt: 'High school students in lab coats carrying out a titration practical' },
  labPractical: { src: labPractical, alt: 'Students in wine checked uniforms and lab coats working together on a science practical' },
  labFunnel: { src: labFunnel, alt: 'A student in a lab coat pouring liquid through a funnel during a chemistry practical' },
  labGroup: { src: labGroup, alt: 'A group of students around a lab bench with retort stands and glassware' },
  highSchoolCampus: { src: highSchoolCampus, alt: 'Red-brick buildings and entrance arch of Gulf Flower High School, with students in the compound' },
  highSchoolArch: { src: highSchoolArch, alt: 'Entrance arch reading Gulf Flower High School, Day and Boarding, between two red-brick blocks' },
  busesHighSchool: { src: busesHighSchool, alt: 'Three branded Gulf Flower Schools buses parked in front of the high school buildings' },
  busesCourtyard: { src: busesCourtyard, alt: 'Gulf Flower Schools buses lined up in the school courtyard' },
  boardersGroup: { src: boardersGroup, alt: 'A group of boarding students in pink house wear standing together outside' },
  boardingDormitory: { src: boardingDormitory, alt: 'Boarding house dormitory with bunk beds and students in pink house wear' },
  securityAssembly: { src: securityAssembly, alt: 'Pupils and students in their uniforms standing with uniformed security officers in the school courtyard' },
  securityOfficers: { src: securityOfficers, alt: 'Uniformed security officers standing beside their patrol vehicle' },
  campusWalkway: { src: campusWalkway, alt: 'Paved walkway between school buildings with a painted wall sign' },
  coveredPlayHall: { src: coveredPlayHall, alt: 'Covered play area with red benches where pupils gather' },
  graduate1: { src: graduate1, alt: 'Graduating student in a boater hat, blazer and Gulf Flower sash' },
  graduate2: { src: graduate2, alt: 'Smiling graduating student in a boater hat and blazer' },
  graduate3: { src: graduate3, alt: 'Graduating student in a blazer, wine checked shirt and Gulf Flower sash' },
  graduate4: { src: graduate4, alt: 'Graduating student smiling in a boater hat and Gulf Flower sash' },
  graduate5: { src: graduate5, alt: 'Graduating student in a boater hat, blazer and sash' },
} satisfies Record<string, Photo>;

export const people = {
  director: { src: director, alt: 'Dr. Cynthia Gregg, Director of Gulf Flower Schools' },
  directorPortrait: { src: directorPortrait, alt: 'Portrait of Dr. Cynthia Gregg, Director of Gulf Flower Schools' },
  principal: { src: principal, alt: 'Mr. Femi Famuwagun, High School Principal' },
  headTeacher: { src: headTeacher, alt: 'Mrs. Omotayo Atode, Head Teacher of the primary school' },
  vpAdmin: { src: vpAdmin, alt: 'Mr. Balogun Wasiu Olaolu, Vice Principal (Administration)' },
} satisfies Record<string, Photo>;
