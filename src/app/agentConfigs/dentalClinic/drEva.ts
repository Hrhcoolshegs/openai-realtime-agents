import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { mockPatients, procedureCosts } from './mockData';

export const drEvaAgent = new RealtimeAgent({
  name: 'drEva',
  voice: 'sage',
  handoffDescription:
    'Primary dental receptionist agent that greets patients, handles basic inquiries, and routes to specialized agents for appointments or emergencies.',

  instructions: `
# Personality and Tone
## Identity
You are Dr. Eva, a warm and professional AI receptionist for Estrabillo Dental Clinic. You have extensive knowledge about dental procedures, insurance processes, and patient care. Your background includes years of experience in dental administration, making you the perfect first point of contact for patients calling the clinic.

## Task
Your primary role is to assist patients with their dental needs, whether that's scheduling appointments, answering basic questions about procedures, or identifying emergency situations that need immediate attention.

## Demeanor
Maintain a caring, professional demeanor that puts patients at ease. You understand that many people have dental anxiety, so you're particularly gentle and reassuring in your approach.

## Tone
Speak in a warm, professional tone that conveys both competence and compassion. You're knowledgeable but never condescending, and you always prioritize the patient's comfort and understanding.

## Level of Enthusiasm
Moderately enthusiastic about helping patients achieve good oral health, but never overly energetic in a way that might seem inappropriate for healthcare.

## Level of Formality
Professional but approachable. You use proper medical terminology when appropriate but explain things in simple terms that patients can understand.

## Level of Emotion
Empathetic and supportive, especially when patients express pain, anxiety, or concerns about procedures.

## Filler Words
Use minimal filler words to maintain professionalism, but occasional "um" or "let me see" can help conversations feel natural.

## Pacing
Speak at a measured pace that allows patients to process information, especially when discussing appointment details or medical information.

# Instructions
- Always greet callers with "Hello, you've reached Estrabillo Dental Clinic. This is Dr. Eva, how may I help you today?"
- Listen carefully for emergency keywords like "severe pain," "bleeding," "swelling," "broken tooth," or "urgent"
- For emergency situations, immediately transfer to the emergency triage agent
- For appointment requests, gather basic information before transferring to the appointment specialist
- Always confirm patient information by repeating it back
- Be empathetic to patient concerns and dental anxiety
- Provide general information about common procedures when asked
- Never provide specific medical advice - always recommend speaking with the dentist

# Emergency Keywords to Watch For
- Severe pain, excruciating pain, unbearable pain
- Heavy bleeding, won't stop bleeding
- Facial swelling, jaw swelling
- Broken tooth, knocked out tooth, lost filling
- Infection, abscess, pus
- Urgent, emergency, can't wait

# Common Procedures Information
- Routine cleaning: Every 6 months, takes about 1 hour
- Dental exam: Comprehensive check-up with X-rays if needed
- Fillings: Treatment for cavities, usually completed in one visit
- Root canal: Treatment for infected tooth pulp, may require multiple visits
- Crowns: Cap placed over damaged tooth, requires two visits
- Extractions: Tooth removal, simple or surgical depending on case

# Sample Responses
## General Information
- "A routine cleaning typically takes about an hour and we recommend them every six months for optimal oral health."
- "Root canal treatment helps save a tooth that has infected pulp. Dr. Estrabillo can explain the specific process during your consultation."

## Appointment Scheduling
- "I'd be happy to help you schedule an appointment. Let me transfer you to our appointment specialist who can check our calendar and find the best time for you."

## Emergency Response
- "I understand you're experiencing severe pain. Let me immediately connect you with our emergency triage specialist who can assess your situation and get you the help you need right away."

# Tools Available
- lookupPatient: Find existing patient records
- getBasicInfo: Provide general information about procedures
- Always transfer to appropriate specialist agents for specific actions
`,

  tools: [
    tool({
      name: 'lookupPatient',
      description: 'Look up existing patient information by phone number or name.',
      parameters: {
        type: 'object',
        properties: {
          phone_number: {
            type: 'string',
            description: 'Patient phone number in format (xxx) xxx-xxxx',
          },
          patient_name: {
            type: 'string',
            description: 'Patient full name if phone number not available',
          },
        },
        additionalProperties: false,
      },
      execute: async (input: any) => {
        // Mock patient data
        const patients = [
          {
            id: 'P001',
            name: 'Maria Rodriguez',
            phone: '(555) 123-4567',
            email: 'maria.rodriguez@email.com',
            last_visit: '2024-10-15',
            next_cleaning: '2025-04-15',
            insurance: 'Delta Dental',
            notes: 'Prefers morning appointments, has dental anxiety'
          },
          {
            id: 'P002',
            name: 'John Smith',
            phone: '(555) 234-5678',
            email: 'john.smith@email.com',
            last_visit: '2024-11-20',
            next_cleaning: '2025-05-20',
            insurance: 'Cigna',
            notes: 'Regular patient, no special needs'
          },
          {
            id: 'P003',
            name: 'Sarah Johnson',
            phone: '(555) 345-6789',
            email: 'sarah.johnson@email.com',
            last_visit: '2024-09-30',
            next_cleaning: '2025-03-30',
            insurance: 'Aetna',
            notes: 'Needs sedation for procedures'
          }
        ];

        const { phone_number, patient_name } = input;
        
        let patient = null;
        if (phone_number) {
          patient = mockPatients.find(p => p.phone === phone_number);
        } else if (patient_name) {
          patient = mockPatients.find(p => 
            p.name.toLowerCase().includes(patient_name.toLowerCase())
          );
        }

        if (patient) {
          return {
            found: true,
            patient: {
              name: patient.name,
              phone: patient.phone,
              last_visit: patient.dental_history.last_cleaning,
              next_cleaning_due: patient.dental_history.next_cleaning_due,
              insurance: patient.insurance.provider,
              notes: patient.dental_history.notes
            }
          };
        } else {
          return {
            found: false,
            message: 'No patient found with that information. They may be a new patient.'
          };
        }
      },
    }),

    tool({
      name: 'getBasicInfo',
      description: 'Provide general information about dental procedures and clinic policies.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            enum: ['cleaning', 'exam', 'filling', 'root_canal', 'crown', 'extraction', 'hours', 'insurance', 'cost'],
            description: 'The topic the patient is asking about',
          },
        },
        required: ['topic'],
        additionalProperties: false,
      },
      execute: async (input: any) => {
        const { topic } = input;
        
        const info: Record<string, any> = {
          cleaning: {
            description: 'Routine dental cleaning removes plaque and tartar buildup',
            duration: '45-60 minutes',
            frequency: 'Every 6 months recommended',
            cost_range: `$${procedureCosts.cleaning.min}-$${procedureCosts.cleaning.max}`,
            insurance_coverage: `${procedureCosts.cleaning.insurance_covered}% typically covered`
          },
          exam: {
            description: 'Comprehensive dental examination with X-rays if needed',
            duration: '30-45 minutes',
            frequency: 'Annually or as recommended',
            cost_range: `$${procedureCosts.exam.min}-$${procedureCosts.exam.max}`,
            insurance_coverage: `${procedureCosts.exam.insurance_covered}% typically covered`
          },
          filling: {
            description: 'Treatment for cavities using composite or amalgam material',
            duration: '30-60 minutes',
            frequency: 'As needed',
            cost_range: `$${procedureCosts.filling.min}-$${procedureCosts.filling.max}`,
            insurance_coverage: `${procedureCosts.filling.insurance_covered}% typically covered`
          },
          root_canal: {
            description: 'Treatment for infected tooth pulp to save the tooth',
            duration: '60-90 minutes',
            frequency: 'As needed',
            cost_range: `$${procedureCosts.root_canal.min}-$${procedureCosts.root_canal.max}`,
            insurance_coverage: `${procedureCosts.root_canal.insurance_covered}% typically covered`
          },
          crown: {
            description: 'Protective cap placed over damaged or weakened tooth',
            duration: 'Two visits, 60 minutes each',
            frequency: 'As needed',
            cost_range: `$${procedureCosts.crown.min}-$${procedureCosts.crown.max}`,
            insurance_coverage: `${procedureCosts.crown.insurance_covered}% typically covered`
          },
          extraction: {
            description: 'Tooth removal, simple or surgical depending on case',
            duration: '30-60 minutes',
            frequency: 'As needed',
            cost_range: `$${procedureCosts.extraction.min}-$${procedureCosts.extraction.max}`,
            insurance_coverage: `${procedureCosts.extraction.insurance_covered}% typically covered`
          },
          hours: {
            description: 'Clinic hours and availability',
            schedule: 'Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM, Sunday: Closed',
            emergency: 'Emergency line available 24/7 for urgent cases'
          },
          insurance: {
            description: 'Insurance and payment information',
            accepted: 'Delta Dental, Cigna, Aetna, MetLife, and most major dental insurance plans',
            payment: 'Cash, credit cards, CareCredit financing available'
          },
          cost: {
            description: 'General cost information',
            note: 'Costs vary based on treatment complexity and insurance coverage',
            consultation: 'Free consultation for new patients'
          }
        };

        return info[topic as keyof typeof info] || { error: 'Information not available' };
      },
    }),
  ],

  handoffs: [], // populated in index.ts
});