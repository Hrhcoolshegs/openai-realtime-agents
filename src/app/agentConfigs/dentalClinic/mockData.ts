// Mock data for dental clinic demonstration

export const mockPatients = [
  {
    id: 'P001',
    name: 'Maria Rodriguez',
    phone: '(555) 123-4567',
    email: 'maria.rodriguez@email.com',
    date_of_birth: '1985-03-15',
    address: '123 Oak Street, Springfield, IL 62701',
    insurance: {
      provider: 'Delta Dental',
      policy_number: 'DD123456789',
      group_number: 'GRP001'
    },
    medical_history: {
      allergies: ['Penicillin'],
      medications: ['Lisinopril'],
      conditions: ['Hypertension']
    },
    dental_history: {
      last_cleaning: '2024-10-15',
      last_exam: '2024-10-15',
      next_cleaning_due: '2025-04-15',
      notes: 'Prefers morning appointments, has dental anxiety, needs gentle approach'
    },
    communication_preferences: {
      reminder_method: 'text',
      language: 'English'
    }
  },
  {
    id: 'P002',
    name: 'John Smith',
    phone: '(555) 234-5678',
    email: 'john.smith@email.com',
    date_of_birth: '1978-07-22',
    address: '456 Maple Avenue, Springfield, IL 62702',
    insurance: {
      provider: 'Cigna',
      policy_number: 'CG987654321',
      group_number: 'GRP002'
    },
    medical_history: {
      allergies: [],
      medications: [],
      conditions: []
    },
    dental_history: {
      last_cleaning: '2024-11-20',
      last_exam: '2024-11-20',
      next_cleaning_due: '2025-05-20',
      notes: 'Regular patient, no special accommodations needed'
    },
    communication_preferences: {
      reminder_method: 'email',
      language: 'English'
    }
  },
  {
    id: 'P003',
    name: 'Sarah Johnson',
    phone: '(555) 345-6789',
    email: 'sarah.johnson@email.com',
    date_of_birth: '1992-12-08',
    address: '789 Pine Road, Springfield, IL 62703',
    insurance: {
      provider: 'Aetna',
      policy_number: 'AE456789123',
      group_number: 'GRP003'
    },
    medical_history: {
      allergies: ['Latex'],
      medications: ['Birth control'],
      conditions: []
    },
    dental_history: {
      last_cleaning: '2024-09-30',
      last_exam: '2024-09-30',
      next_cleaning_due: '2025-03-30',
      notes: 'Requires sedation for procedures, latex allergy - use non-latex gloves'
    },
    communication_preferences: {
      reminder_method: 'phone',
      language: 'English'
    }
  },
  {
    id: 'P004',
    name: 'Carlos Mendoza',
    phone: '(555) 456-7890',
    email: 'carlos.mendoza@email.com',
    date_of_birth: '1980-05-12',
    address: '321 Elm Street, Springfield, IL 62704',
    insurance: {
      provider: 'MetLife',
      policy_number: 'ML789123456',
      group_number: 'GRP004'
    },
    medical_history: {
      allergies: [],
      medications: ['Metformin'],
      conditions: ['Type 2 Diabetes']
    },
    dental_history: {
      last_cleaning: '2024-08-15',
      last_exam: '2024-08-15',
      next_cleaning_due: '2025-02-15',
      notes: 'Diabetic patient - monitor for gum disease, prefers Spanish communication'
    },
    communication_preferences: {
      reminder_method: 'text',
      language: 'Spanish'
    }
  },
  {
    id: 'P005',
    name: 'Jennifer Chen',
    phone: '(555) 567-8901',
    email: 'jennifer.chen@email.com',
    date_of_birth: '1995-09-03',
    address: '654 Birch Lane, Springfield, IL 62705',
    insurance: {
      provider: 'Guardian',
      policy_number: 'GU321654987',
      group_number: 'GRP005'
    },
    medical_history: {
      allergies: ['Codeine'],
      medications: [],
      conditions: []
    },
    dental_history: {
      last_cleaning: '2024-12-01',
      last_exam: '2024-12-01',
      next_cleaning_due: '2025-06-01',
      notes: 'Young professional, prefers evening appointments, excellent oral hygiene'
    },
    communication_preferences: {
      reminder_method: 'email',
      language: 'English'
    }
  }
];

export const mockAppointments = [
  {
    id: 'APPT-001',
    patient_id: 'P001',
    patient_name: 'Maria Rodriguez',
    date: '2025-01-20',
    time: '9:00 AM',
    type: 'cleaning',
    duration: 60,
    status: 'scheduled',
    provider: 'Dr. Estrabillo',
    notes: 'Regular cleaning, patient has dental anxiety'
  },
  {
    id: 'APPT-002',
    patient_id: 'P002',
    patient_name: 'John Smith',
    date: '2025-01-22',
    time: '2:00 PM',
    type: 'exam',
    duration: 45,
    status: 'scheduled',
    provider: 'Dr. Estrabillo',
    notes: 'Annual exam'
  },
  {
    id: 'APPT-003',
    patient_id: 'P003',
    patient_name: 'Sarah Johnson',
    date: '2025-01-24',
    time: '10:00 AM',
    type: 'filling',
    duration: 90,
    status: 'scheduled',
    provider: 'Dr. Estrabillo',
    notes: 'Composite filling, upper left molar, sedation required'
  },
  {
    id: 'APPT-004',
    patient_id: 'P004',
    patient_name: 'Carlos Mendoza',
    date: '2025-01-15',
    time: '3:00 PM',
    type: 'consultation',
    duration: 30,
    status: 'scheduled',
    provider: 'Dr. Estrabillo',
    notes: 'Crown consultation, Spanish interpreter if needed'
  },
  {
    id: 'APPT-005',
    patient_id: 'P005',
    patient_name: 'Jennifer Chen',
    date: '2025-01-28',
    time: '5:30 PM',
    type: 'cleaning',
    duration: 60,
    status: 'scheduled',
    provider: 'Dr. Estrabillo',
    notes: 'Evening appointment as requested'
  }
];

export const procedureCosts = {
  cleaning: { min: 75, max: 150, insurance_covered: 80 },
  exam: { min: 100, max: 200, insurance_covered: 90 },
  consultation: { min: 50, max: 100, insurance_covered: 70 },
  filling: { min: 150, max: 400, insurance_covered: 60 },
  crown: { min: 800, max: 2000, insurance_covered: 50 },
  root_canal: { min: 800, max: 1500, insurance_covered: 60 },
  extraction: { min: 150, max: 600, insurance_covered: 70 },
  whitening: { min: 300, max: 800, insurance_covered: 0 },
  implant: { min: 2000, max: 5000, insurance_covered: 30 }
};

export const emergencyScenarios = [
  {
    id: 'EMG-001',
    symptoms: 'Severe toothache, throbbing pain',
    pain_level: 8,
    severity: 8,
    recommended_action: 'same_day_emergency',
    care_instructions: 'Take ibuprofen, apply cold compress, avoid hot/cold foods'
  },
  {
    id: 'EMG-002',
    symptoms: 'Knocked out tooth from sports injury',
    pain_level: 6,
    severity: 9,
    recommended_action: 'immediate_emergency',
    care_instructions: 'Keep tooth in milk, come in immediately for best chance of saving tooth'
  },
  {
    id: 'EMG-003',
    symptoms: 'Lost filling, mild sensitivity',
    pain_level: 3,
    severity: 4,
    recommended_action: 'urgent_appointment',
    care_instructions: 'Avoid chewing on that side, use temporary filling material if available'
  }
];