// Mock data for hospital doctors
const doctors = [
  {
    id: '1',
    name: 'Dr. Anika Sharma',
    specialization: 'Cardiologist',
    experience: '15 years',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    description:
      'Dr. Anika Sharma is a renowned cardiologist with over 15 years of experience in treating heart conditions. She specializes in interventional cardiology and has performed over 3,000 successful procedures. She is known for her patient-first approach and dedication to cutting-edge cardiac care.',
    rating: 4.9,
    patients: '2,500+',
    fee: '$120',
    availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
  },
  {
    id: '2',
    name: 'Dr. Rajesh Patel',
    specialization: 'Dentist',
    experience: '10 years',
    profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    description:
      'Dr. Rajesh Patel is an expert dentist specializing in cosmetic dentistry and oral surgery. With a decade of experience, he has helped thousands of patients achieve their dream smiles. He uses the latest dental technology and techniques for painless treatments.',
    rating: 4.8,
    patients: '3,200+',
    fee: '$80',
    availableSlots: ['9:30 AM', '10:30 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:30 PM'],
  },
  {
    id: '3',
    name: 'Dr. Priya Mehta',
    specialization: 'Physiotherapist',
    experience: '8 years',
    profileImage: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop&crop=face',
    description:
      'Dr. Priya Mehta is a skilled physiotherapist who helps patients recover from injuries, surgeries, and chronic pain conditions. She combines manual therapy with exercise-based rehabilitation to ensure the fastest and most sustainable recovery outcomes.',
    rating: 4.7,
    patients: '1,800+',
    fee: '$65',
    availableSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '3:00 PM', '5:00 PM'],
  },
  {
    id: '4',
    name: 'Dr. Vikram Singh',
    specialization: 'Neurologist',
    experience: '20 years',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face',
    description:
      'Dr. Vikram Singh is a leading neurologist with two decades of experience in diagnosing and treating complex neurological disorders. He has published numerous research papers and is an active member of several international neurology societies.',
    rating: 4.9,
    patients: '4,100+',
    fee: '$150',
    availableSlots: ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'],
  },
  {
    id: '5',
    name: 'Dr. Sneha Kulkarni',
    specialization: 'Dermatologist',
    experience: '12 years',
    profileImage: null,
    description:
      'Dr. Sneha Kulkarni is a board-certified dermatologist with expertise in treating skin, hair, and nail disorders. She offers advanced treatments including laser therapy, chemical peels, and anti-aging procedures with a holistic approach to skin health.',
    rating: 4.8,
    patients: '2,900+',
    fee: '$100',
    availableSlots: ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
  },
  {
    id: '6',
    name: 'Dr. Arjun Reddy',
    specialization: 'Orthopedic',
    experience: '18 years',
    profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face',
    description:
      'Dr. Arjun Reddy is a highly experienced orthopedic surgeon specializing in joint replacements, sports injuries, and spinal disorders. He has performed over 5,000 surgeries and is known for his minimally invasive surgical techniques.',
    rating: 4.9,
    patients: '3,800+',
    fee: '$140',
    availableSlots: ['8:30 AM', '10:00 AM', '11:30 AM', '1:30 PM', '3:30 PM'],
  },
  {
    id: '7',
    name: 'Dr. Kavita Nair',
    specialization: 'Pediatrician',
    experience: '14 years',
    profileImage: 'https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=300&h=300&fit=crop&crop=face',
    description:
      'Dr. Kavita Nair is a compassionate pediatrician dedicated to children\'s health and well-being. She provides comprehensive pediatric care from newborns to adolescents, including vaccinations, developmental assessments, and treatment of childhood illnesses.',
    rating: 4.8,
    patients: '5,200+',
    fee: '$75',
    availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
  },
  {
    id: '8',
    name: 'Dr. Sanjay Gupta',
    specialization: 'ENT Specialist',
    experience: '16 years',
    profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    description:
      'Dr. Sanjay Gupta is a renowned ENT specialist with expertise in treating disorders of the ear, nose, and throat. He specializes in endoscopic sinus surgery, hearing restoration, and voice disorders, bringing relief to thousands of patients.',
    rating: 4.7,
    patients: '2,600+',
    fee: '$90',
    availableSlots: ['9:30 AM', '11:00 AM', '12:30 PM', '2:00 PM', '3:30 PM', '5:00 PM'],
  },
];

export const specializations = [
  'All',
  'Cardiologist',
  'Dentist',
  'Physiotherapist',
  'Neurologist',
  'Dermatologist',
  'Orthopedic',
  'Pediatrician',
  'ENT Specialist',
];

export default doctors;
